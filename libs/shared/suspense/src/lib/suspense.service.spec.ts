import { TestBed } from '@angular/core/testing';

import { SuspenseService } from './suspense.service';

describe('SuspenseService', () => {
  let service: SuspenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuspenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
