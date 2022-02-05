import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingDirective } from '@david-bulte/angular-suspense';
import { SuspenseService } from '../suspense.service';

import { DefaultTemplatesComponent } from './default-templates.component';

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
      declarations: [
        TestDefaultTemplatesComponent,
        DefaultTemplatesComponent,
        LoadingDirective,
      ],
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
