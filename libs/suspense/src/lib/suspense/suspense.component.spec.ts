import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { SuspenseModule } from '../..';

import { LoadingStates, SuspenseComponent } from './suspense.component';

class TestService {
  masterLoadingState$ = new BehaviorSubject(LoadingStates.LOADING);
  detailLoadingState$ = new BehaviorSubject(LoadingStates.LOADING);
}

@Component({
  selector: 'susp-detail',
  template: `
    <susp [state]="state$$ | async" [debug]="'detail'">
      <ng-template suspLoading>loading detail...</ng-template>
      <ng-template suspEmpty>empty detail...</ng-template>
    </susp>
  `,
})
class TestSuspenseDetailComponent {
  @ViewChild(SuspenseComponent, { static: true })
  suspenseComponent!: SuspenseComponent;
  state$$ = this.testService.detailLoadingState$;

  constructor(private testService: TestService) {}
}

@Component({
  template: `
    <susp [state]="state$$ | async" [debug]="'master'" #suspenseComponent>
      <susp-detail #detailComponent></susp-detail>
      <ng-template suspLoading>loading master/detail...</ng-template>
      <ng-template suspEmpty>empty loading master/detail...</ng-template>
    </susp>
  `,
})
class TestSuspenseMasterComponent {
  @ViewChild(SuspenseComponent, { static: true })
  suspenseComponent!: SuspenseComponent;
  @ViewChild(TestSuspenseDetailComponent, { static: true })
  detailComponent!: SuspenseComponent;
  state$$ = this.testService.masterLoadingState$;
  LOADING_MESSAGE = LOADING_MASTER_MESSAGE;
  constructor(private testService: TestService) {}
}

const LOADING_MASTER_MESSAGE = 'loading master/detail...';
const LOADING_DETAIL_MESSAGE = 'loading detail...';

describe('SuspenseComponent', () => {
  let component: TestSuspenseMasterComponent;
  let service: TestService;
  let fixture: ComponentFixture<TestSuspenseMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestSuspenseMasterComponent, TestSuspenseDetailComponent],
      imports: [SuspenseModule.forRoot()],
      providers: [TestService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuspenseMasterComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TestService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('if both child and parent is LOADING, the combined state is LOADING and the parent LOADING template should be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);
  });

  test('if child is LOADED and parent is still LOADING, the combined state is LOADING and the parent LOADING template should be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next(LoadingStates.SUCCESS);
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);
  });

  test('if child is still LOADING and parent is LOADED, the combined state is LOADING and the parent LOADING template should be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.masterLoadingState$.next(LoadingStates.SUCCESS);
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);
  });

  test('if child is LOADED and parent is also LOADED, the combined state is LOADED and the LOADING template should not be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next(LoadingStates.SUCCESS);
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.masterLoadingState$.next(LoadingStates.SUCCESS);
    fixture.detectChanges();
    expect(parentEl.textContent).not.toContain(LOADING_MASTER_MESSAGE);
  });

  test('if both child and parent have been LOADED, and the child starts LOADING again, the combined state is still LOADED, and only LOADING template of the child is visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next(LoadingStates.SUCCESS);
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.masterLoadingState$.next(LoadingStates.SUCCESS);
    fixture.detectChanges();
    expect(parentEl.textContent).not.toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next(LoadingStates.LOADING);
    fixture.detectChanges();
    expect(parentEl.textContent).not.toContain(LOADING_MASTER_MESSAGE);
    expect(parentEl.textContent).toContain(LOADING_DETAIL_MESSAGE);
  });
});
