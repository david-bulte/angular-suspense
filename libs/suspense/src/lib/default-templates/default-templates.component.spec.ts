import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuspenseModule, SuspenseService } from '../..';

@Component({
  template: `
    <susp-default-templates>
      <ng-template suspLoading> loading </ng-template>
    </susp-default-templates>
  `,
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestDefaultTemplatesComponent {}

describe('DefaultTemplatesComponent', () => {
  let component: TestDefaultTemplatesComponent;
  let service: SuspenseService;
  let fixture: ComponentFixture<TestDefaultTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestDefaultTemplatesComponent],
      imports: [SuspenseModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDefaultTemplatesComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SuspenseService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('service should have LoadingTemplate when such a template is provided', () => {
    expect(service.defaultLoadingTemplate).toBeTruthy();
  });

  test('service should have EmptyTemplate when such a template is not provided', () => {
    expect(service.defaultEmptyTemplate).toBeFalsy();
  });
});
