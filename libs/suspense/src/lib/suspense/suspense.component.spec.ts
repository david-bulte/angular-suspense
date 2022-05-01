import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { SuspenseModule } from '../..';

import { SuspenseComponent } from './suspense.component';

class TestService {
  masterLoadingState$ = new BehaviorSubject('loading');
  detailLoadingState$ = new BehaviorSubject('loading');
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

  test('if both child and parent is "loading", the combined state is "loading" and the parent "loading" template should be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);
  });

  test('if child is "loaded" and parent is still "loading", the combined state is "loading" and the parent "loading" template should be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next('success');
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);
  });

  test('if child is still "loading" and parent is "loaded", the combined state is "loading" and the parent "loading" template should be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.masterLoadingState$.next('success');
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);
  });

  test('if child is "loaded" and parent is also "loaded", the combined state is "loaded" and the "loading" template should not be visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next('success');
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.masterLoadingState$.next('success');
    fixture.detectChanges();
    expect(parentEl.textContent).not.toContain(LOADING_MASTER_MESSAGE);
  });

  test('if both child and parent have been "loaded", and the child starts LOADING again, the combined state is still "loaded", and only "loading" template of the child is visible', () => {
    const parentEl: HTMLElement = fixture.nativeElement;
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next('success');
    fixture.detectChanges();
    expect(parentEl.textContent).toContain(LOADING_MASTER_MESSAGE);

    service.masterLoadingState$.next('success');
    fixture.detectChanges();
    expect(parentEl.textContent).not.toContain(LOADING_MASTER_MESSAGE);

    service.detailLoadingState$.next('loading');
    fixture.detectChanges();
    expect(parentEl.textContent).not.toContain(LOADING_MASTER_MESSAGE);
    expect(parentEl.textContent).toContain(LOADING_DETAIL_MESSAGE);
  });
});
