import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultTemplatesComponent } from './default-templates.component';

describe('DefaultTemplatesComponent', () => {
  let component: DefaultTemplatesComponent;
  let fixture: ComponentFixture<DefaultTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultTemplatesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
