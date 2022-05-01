import { TestBed } from '@angular/core/testing';
import { SuspenseModule } from '..';

import { SuspenseService } from './suspense.service';

describe('SuspenseService', () => {
  let service: SuspenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuspenseModule.forRoot()],
    });
    service = TestBed.inject(SuspenseService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('default debounce value should be 0', () => {
    expect(service.debounce).toBe(0);
  });
});
