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
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import { EmptyDirective } from '../empty.directive';
import { ErrorDirective } from '../error.directive';
import { LoadingDirective } from '../loading.directive';
import { logger } from '../log-utils';
import { Suspensable } from '../suspensable';
import { SuspenseService } from '../suspense.service';
import { TargetDirective } from '../target.directive';

logger.enableOnly = true;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'susp',
  templateUrl: './suspense.component.html',
  styleUrls: ['./suspense.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuspenseComponent
  implements OnChanges, AfterContentInit, OnDestroy, Suspensable
{
  @Input() debug?: string;
  @Input() state: LoadingState | null = null;
  @Input() debounce!: number;
  @Input() catchError = false;
  @Input() stopPropagation = false;
  @Input() waitFor: number | null = null;

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

  private children$$ = new BehaviorSubject<Suspensable[]>([]);
  private loadingRef?: EmbeddedViewRef<LoadingDirective>;
  private localLoadingState$$ = new BehaviorSubject(null);
  public publicLoadingState$$ = new BehaviorSubject(LoadingStates.LOADING);

  constructor(
    private vcr: ViewContainerRef,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private suspenseService: SuspenseService,
    @Optional() @SkipSelf() private parent?: SuspenseComponent
  ) {
    parent?.registerChild(this);
    this.debounce ??= this.suspenseService.debounce;
  }

  get debugLoadingStatesInTemplate() {
    return this.suspenseService.debugLoadingStatesInTemplate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
      this.localLoadingState$$.next(
        changes['state'].currentValue || LoadingStates.LOADING
      );
    }
  }

  ngAfterContentInit(): void {
    this.setupLoadingStateListener();
  }

  ngOnDestroy(): void {
    this.parent?.removeChild(this);
  }

  public registerChild(child: Suspensable) {
    logger.log('item', this.debug, 'registerChild', child.debug);
    this.children$$.next([...this.children$$.getValue(), child]);
  }

  private removeChild(child: SuspenseComponent) {
    const children = [...this.children$$.getValue()];
    children.splice(children.indexOf(child), 1);
    this.children$$.next(children);
  }

  private setupLoadingStateListener() {
    logger.log(
      'item',
      this.debug,
      'setupLoadingStateListener children',
      this.children$$?.getValue()?.length
    );

    const localLoadingState$: Observable<LoadingState> =
      this.localLoadingState$$.getValue()
        ? this.localLoadingState$$.pipe(
            filter((loadingState) => loadingState !== null),
            map((loadingState) => loadingState as unknown as LoadingState)
          )
        : of(LoadingStates.SUCCESS);

    const childrenLoadingState$: Observable<LoadingState> =
      this.children$$.getValue()?.length === 0 && this.waitFor === null
        ? of(LoadingStates.SUCCESS)
        : this.children$$.pipe(
            filter((children) => {
              return this.waitFor !== null
                ? children.length >= this.waitFor
                : true;
            }),
            switchMap((children) =>
              forkJoin(
                ...children.map((child) => {
                  return child.publicLoadingState$$.pipe(
                    takeWhile(
                      (loadingState) => loadingState === LoadingStates.LOADING,
                      true
                    )
                  );
                })
              )
            ),
            map((childLoadingstates) => {
              return childLoadingstates.indexOf(LoadingStates.ERROR) > -1
                ? LoadingStates.ERROR
                : LoadingStates.SUCCESS;
            }),
            startWith(LoadingStates.LOADING),
            distinctUntilChanged()
          );

    // todo investigate - for some reason tests fail when using debounce
    const combinedLoadingState$ =
      this.debounce > 0
        ? combineLatest(localLoadingState$, childrenLoadingState$).pipe(
            map((loadingStates) => this.extractLoadingState(loadingStates)),
            debounce((status) => timer(this.getDebounceTime(status))),
            distinctUntilChanged()
          )
        : combineLatest(localLoadingState$, childrenLoadingState$).pipe(
            map((loadingStates) => this.extractLoadingState(loadingStates))
          );

    combinedLoadingState$.subscribe((loadingState) => {
      logger.log('item', this.debug, 'combined states 2', loadingState);

      this.renderer.addClass(
        this.elRef.nativeElement,
        '__suspense--hide-all__'
      );

      this.container.vcr.clear();

      switch (loadingState) {
        case LoadingStates.EMPTY:
          this.loadingRef = this.container.vcr.createEmbeddedView(
            this.getEmptyDirective(),
            { $implicit: undefined }
          );
          logger.log('this.loadingRef', this.loadingRef);
          this.loadingRef.rootNodes.forEach((rootNode) => {
            if (rootNode.nodeType !== Node.TEXT_NODE) {
              this.renderer.addClass(rootNode, '__suspense__');
            }
          });
          logger.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingStates.ERROR
          );
          this.publicLoadingState$$.next(
            this.catchError || this.stopPropagation
              ? LoadingStates.SUCCESS
              : LoadingStates.ERROR
          );
          break;
        case LoadingStates.ERROR:
          this.loadingRef = this.container.vcr.createEmbeddedView(
            this.getErrorDirective(),
            { $implicit: undefined }
          );
          this.loadingRef.rootNodes.forEach((rootNode) => {
            if (rootNode.nodeType !== Node.TEXT_NODE) {
              this.renderer.addClass(rootNode, '__suspense__');
            }
          });
          logger.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingStates.ERROR
          );
          this.publicLoadingState$$.next(
            this.catchError || this.stopPropagation
              ? LoadingStates.SUCCESS
              : LoadingStates.ERROR
          );
          break;
        case LoadingStates.LOADING:
          logger.only(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingStates.LOADING
          );
          this.loadingRef = this.container.vcr.createEmbeddedView(
            this.getLoadingDirective(),
            { $implicit: undefined }
          );
          this.loadingRef.rootNodes.forEach((rootNode) => {
            if (rootNode.nodeType !== Node.TEXT_NODE) {
              this.renderer.addClass(rootNode, '__suspense__');
            }
          });
          this.renderer.addClass(
            this.elRef.nativeElement,
            '__suspense--loading__'
          );
          if (this.stopPropagation) {
            this.publicLoadingState$$.next(LoadingStates.SUCCESS);
          }
          break;
        case LoadingStates.SUCCESS:
          this.renderer.removeClass(
            this.elRef.nativeElement,
            '__suspense--hide-all__'
          );
          logger.log(
            'item',
            this.debug,
            'publicLoadingState$$.next',
            LoadingStates.SUCCESS
          );
          this.publicLoadingState$$.next(LoadingStates.SUCCESS);
          break;
        default:
        // all hidden
      }

      this.setStateClass(loadingState);
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
    logger.log(
      'item',
      this.debug,
      'combined states 1',
      localLoadingState,
      childrenLoadingState
    );

    if (
      localLoadingState === LoadingStates.SUCCESS &&
      childrenLoadingState === LoadingStates.SUCCESS
    ) {
      return LoadingStates.SUCCESS;
    } else if (
      localLoadingState === LoadingStates.ERROR ||
      childrenLoadingState === LoadingStates.ERROR
    ) {
      return LoadingStates.ERROR;
    } else if (
      localLoadingState === LoadingStates.EMPTY &&
      childrenLoadingState !== LoadingStates.LOADING
    ) {
      return LoadingStates.EMPTY;
    } else {
      return LoadingStates.LOADING;
    }
  }

  private getDebounceTime(status: LoadingState) {
    return status === LoadingStates.LOADING ? this.debounce : 0;
  }

  private setStateClass(loadingState: LoadingState) {
    this.renderer.removeClass(this.elRef.nativeElement, '__suspense--error__');
    this.renderer.removeClass(
      this.elRef.nativeElement,
      '__suspense--loading__'
    );
    this.renderer.removeClass(this.elRef.nativeElement, '__suspense--empty__');
    this.renderer.removeClass(
      this.elRef.nativeElement,
      '__suspense--success__'
    );
    this.renderer.addClass(
      this.elRef.nativeElement,
      `__suspense--${loadingState}__`.toLowerCase()
    );
  }

  wait() {
    const waiting$$ = new BehaviorSubject(LoadingStates.LOADING);
    this.registerChild({
      publicLoadingState$$: waiting$$,
    });
    return () => {
      setTimeout(() => {
        waiting$$.next(LoadingStates.SUCCESS);
      });
    };
  }
}

export type LoadingState = 'LOADING' | 'SUCCESS' | 'EMPTY' | 'ERROR';

export const LoadingStates: { [key in LoadingState]: LoadingState } = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  EMPTY: 'EMPTY',
  ERROR: 'ERROR',
};
