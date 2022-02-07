import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  Renderer2,
  SimpleChanges,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  of,
  timer,
} from 'rxjs';
import {
  debounce,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  takeWhile,
} from 'rxjs/operators';
import { EmptyDirective } from '../empty.directive';
import { ErrorDirective } from '../error.directive';
import { LoadingDirective } from '../loading.directive';
import { SuspenseService } from '../suspense.service';
import { TargetDirective } from '../target.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'susp',
  templateUrl: './suspense.component.html',
  styleUrls: ['./suspense.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuspenseComponent
  implements OnChanges, AfterContentInit, OnDestroy
{
  @Input() debug?: string;
  @Input() state: LoadingState | null = null;
  @Input() timeout!: number;
  @Input() catchError = false;
  @Input() stopPropagation = false;
  @Input() context: any;

  @ContentChildren(ErrorDirective, { read: TemplateRef, descendants: false })
  errorDirective!: QueryList<TemplateRef<ErrorDirective>>;
  @ContentChildren(LoadingDirective, { read: TemplateRef, descendants: false })
  loadingDirective!: QueryList<TemplateRef<LoadingDirective>>;
  @ContentChildren(EmptyDirective, { read: TemplateRef, descendants: false })
  emptyDirective!: QueryList<TemplateRef<EmptyDirective>>;
  @ViewChild(TargetDirective, { static: true }) container!: TargetDirective;

  // default templates
  @ViewChild(LoadingDirective, { read: TemplateRef, static: true })
  defaultLoadingDirective!: TemplateRef<LoadingDirective>;
  @ViewChild(EmptyDirective, { read: TemplateRef, static: true })
  defaultEmptyDirective!: TemplateRef<EmptyDirective>;
  @ViewChild(ErrorDirective, { read: TemplateRef, static: true })
  defaultErrorDirective!: TemplateRef<ErrorDirective>;

  children: SuspenseComponent[] = [];
  private loadingRef?: EmbeddedViewRef<LoadingDirective>;
  private localLoadingState$$ = new BehaviorSubject(null);
  private publicLoadingState$$ = new BehaviorSubject(LoadingState.LOADING);

  constructor(
    private vcr: ViewContainerRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private suspenseService: SuspenseService,
    @Optional() @SkipSelf() private parent?: SuspenseComponent
  ) {
    parent?.registerChild(this);
    this.timeout ??= this.suspenseService.timeout;
  }

  get debugLoadingStatesInTemplate() {
    return this.suspenseService.debugLoadingStatesInTemplate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
      this.localLoadingState$$.next(
        changes['state'].currentValue || LoadingState.LOADING
      );
    }
  }

  ngAfterContentInit(): void {
    this.setupLoadingStateListener();
  }

  ngOnDestroy(): void {
    this.parent?.removeChild(this);
  }

  private registerChild(child: SuspenseComponent) {
    console.log('item', this.debug, 'registerChild', child.debug);
    this.children = [...this.children, child];
  }

  private removeChild(child: SuspenseComponent) {
    const children = [...this.children];
    children.splice(children.indexOf(child), 1);
    this.children = children;
  }

  private setupLoadingStateListener() {
    console.log(
      'item',
      this.debug,
      'setupLoadingStateListener children',
      this.children?.length
    );

    const localLoadingState$: Observable<LoadingState> =
      this.localLoadingState$$.getValue()
        ? this.localLoadingState$$.pipe(
            filter((loadingState) => loadingState !== null),
            map((loadingState) => loadingState as unknown as LoadingState)
          )
        : of(LoadingState.SUCCESS);

    const childrenLoadingState$: Observable<LoadingState> =
      this.children?.length > 0
        ? forkJoin(
            ...this.children.map((child) => {
              return child.publicLoadingState$$.pipe(
                takeWhile(
                  (loadingState) => loadingState === LoadingState.LOADING,
                  true
                )
              );
            })
          ).pipe(
            map((childLoadingstates) => {
              return childLoadingstates.indexOf(LoadingState.ERROR) > -1
                ? LoadingState.ERROR
                : LoadingState.SUCCESS;
            }),
            startWith(LoadingState.LOADING),
            distinctUntilChanged()
          )
        : of(LoadingState.SUCCESS);

    // todo investigate - for some reason tests fail when using debounce
    const combinedLoadingState$ =
      this.timeout > 0
        ? combineLatest(localLoadingState$, childrenLoadingState$).pipe(
            map((loadingStates) => this.extractLoadingState(loadingStates)),
            debounce((status) => timer(this.getTimeout(status))),
            distinctUntilChanged()
          )
        : combineLatest(localLoadingState$, childrenLoadingState$).pipe(
            map((loadingStates) => this.extractLoadingState(loadingStates))
          );

    combinedLoadingState$.subscribe((loadingState) => {
      console.log('item', this.debug, 'combined states 2', loadingState);

      this.renderer.addClass(
        this.elRef.nativeElement,
        '__suspense--hide-all__'
      );

      this.container.vcr.clear();

      switch (loadingState) {
        case LoadingState.EMPTY:
          this.loadingRef = this.container.vcr.createEmbeddedView(
            this.getEmptyDirective(),
            { $implicit: this.context }
          );
          console.log('this.loadingRef', this.loadingRef);
          this.loadingRef.rootNodes.forEach((rootNode) => {
            console.log('rootNode', rootNode);
            this.renderer.addClass(rootNode, '__suspense__');
          });
          console.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingState.ERROR
          );
          this.publicLoadingState$$.next(
            this.catchError || this.stopPropagation
              ? LoadingState.SUCCESS
              : LoadingState.ERROR
          );
          break;
        case LoadingState.ERROR:
          this.loadingRef = this.container.vcr.createEmbeddedView(
            this.getErrorDirective(),
            { $implicit: this.context }
          );
          // todo skip comments
          this.loadingRef.rootNodes.forEach((rootNode) => {
            this.renderer.addClass(rootNode, '__suspense__');
          });
          console.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingState.ERROR
          );
          this.publicLoadingState$$.next(
            this.catchError || this.stopPropagation
              ? LoadingState.SUCCESS
              : LoadingState.ERROR
          );
          break;
        case LoadingState.LOADING:
          console.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingState.LOADING
          );
          this.loadingRef = this.container.vcr.createEmbeddedView(
            this.getLoadingDirective(),
            { $implicit: this.context }
          );
          this.loadingRef.rootNodes.forEach((rootNode) => {
            this.renderer.addClass(rootNode, '__suspense__');
          });
          if (this.stopPropagation) {
            this.publicLoadingState$$.next(LoadingState.SUCCESS);
          }
          break;
        case LoadingState.SUCCESS:
          this.renderer.removeClass(
            this.elRef.nativeElement,
            '__suspense--hide-all__'
          );
          console.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingState.SUCCESS
          );
          this.publicLoadingState$$.next(LoadingState.SUCCESS);
          break;
        default:
        // all hidden
      }
    });
  }

  private getEmptyDirective() {
    return this.emptyDirective.length > 0
      ? this.emptyDirective.first
      : this.suspenseService.defaultEmptyTemplate || this.defaultEmptyDirective;
  }

  private getLoadingDirective() {
    return this.loadingDirective.length > 0
      ? this.loadingDirective.first
      : this.suspenseService.defaultLoadingTemplate ||
          this.defaultLoadingDirective;
  }

  private getErrorDirective() {
    return this.errorDirective.length > 0
      ? this.errorDirective.first
      : this.suspenseService.defaultErrorTemplate || this.defaultErrorDirective;
  }

  private extractLoadingState([
    localLoadingState,
    childrenLoadingState,
  ]: LoadingState[]) {
    console.log(
      'item',
      this.debug,
      'combined states 1',
      localLoadingState,
      childrenLoadingState
    );

    if (
      localLoadingState === LoadingState.SUCCESS &&
      childrenLoadingState === LoadingState.SUCCESS
    ) {
      return LoadingState.SUCCESS;
    } else if (
      localLoadingState === LoadingState.ERROR ||
      childrenLoadingState === LoadingState.ERROR
    ) {
      return LoadingState.ERROR;
    } else if (
      localLoadingState === LoadingState.EMPTY &&
      childrenLoadingState !== LoadingState.LOADING
    ) {
      return LoadingState.EMPTY;
    } else {
      return LoadingState.LOADING;
    }
  }

  private getTimeout(status: LoadingState) {
    return status === LoadingState.LOADING ? this.timeout : 0;
  }
}

export enum LoadingState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  EMPTY = 'EMPTY',
  ERROR = 'ERROR',
}
