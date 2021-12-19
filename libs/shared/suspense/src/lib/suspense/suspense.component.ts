import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
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
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  startWith,
  takeWhile,
} from 'rxjs';
import { EmptyDirective } from '../empty.directive';
import { ErrorDirective } from '../error.directive';
import { LoadingDirective } from '../loading.directive';
import { SuccessDirective } from '../success.directive';
import { SuspenseService } from '../suspense.service';
import { TargetDirective } from '../target.directive';

@Component({
  selector: 'app-suspense',
  templateUrl: './suspense.component.html',
  styleUrls: ['./suspense.component.css'],
})
export class SuspenseComponent
  implements OnChanges, AfterContentInit, AfterViewInit, OnDestroy
{
  @Input() debug?: string;
  @Input() loadingState: LoadingState | null = null;
  @Input() catchError = false;
  @Input() stopPropagation = false;

  @ContentChild(SuccessDirective) successDirective!: SuccessDirective;
  // @ContentChild(ErrorDirective, { read: TemplateRef })
  // errorDirective!: TemplateRef<ErrorDirective>;
  @ContentChildren(ErrorDirective, { read: TemplateRef, descendants: false })
  errorDirective!: QueryList<TemplateRef<ErrorDirective>>;
  @ContentChildren(LoadingDirective, { read: TemplateRef, descendants: false })
  loadingDirective!: QueryList<TemplateRef<LoadingDirective>>;
  // @ContentChild(LoadingDirective, { read: TemplateRef, static: true })
  // loadingDirective!: TemplateRef<LoadingDirective>;
  @ContentChildren(EmptyDirective, { read: TemplateRef, descendants: false })
  emptyDirective!: QueryList<TemplateRef<EmptyDirective>>;
  // @ContentChild(EmptyDirective, { read: TemplateRef })
  // emptyDirective!: TemplateRef<EmptyDirective>;
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
  // private localLoadingState$$ = new BehaviorSubject(LoadingState.LOADING);
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
  }

  get debugLoadingStatesInTemplate() {
    return this.suspenseService.debugLoadingStatesInTemplate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loadingState) {
      this.localLoadingState$$.next(
        changes.loadingState.currentValue || LoadingState.LOADING
      );
    }
  }

  ngAfterContentInit(): void {
    if (!this.successDirective) {
      this.renderer.setAttribute(
        this.elRef.nativeElement,
        'visibility',
        'hidden'
      );
    }
    this.setupLoadingStateListener();
  }

  ngAfterViewInit(): void {
    // this.setupLoadingStateListener();
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

    combineLatest(localLoadingState$, childrenLoadingState$).subscribe(
      ([localLoadingState, childrenLoadingState]) => {
        console.log(
          'item',
          this.debug,
          'combined states 1',
          localLoadingState,
          childrenLoadingState
        );
        const loadingState = extractLoadingState(
          localLoadingState,
          childrenLoadingState
        );

        console.log('item', this.debug, 'combined states 2', loadingState);

        this.successDirective?.hide();
        this.container.vcr.clear();

        switch (loadingState) {
          case LoadingState.EMPTY:
            this.loadingRef = this.container.vcr.createEmbeddedView(
              this.getEmptyDirective()
            );
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
              this.getErrorDirective()
            );
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
              this.getLoadingDirective()
            );
            if (this.stopPropagation) {
              this.publicLoadingState$$.next(LoadingState.SUCCESS);
            }
            break;
          case LoadingState.SUCCESS:
            if (!this.successDirective) {
              console.log('yeag!!!!!!!!!!!!!!!!!');
              this.renderer.setAttribute(
                this.elRef.nativeElement,
                'visibility',
                'visible'
              );
            } else {
              this.successDirective?.show();
            }
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
      }
    );
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
}

function extractLoadingState(
  localLoadingState: LoadingState,
  childrenLoadingState: LoadingState
) {
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

export enum LoadingState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  EMPTY = 'EMPTY',
  ERROR = 'ERROR',
}
