import { TestBed } from '@angular/core/testing';

import { TaskTimeApiService } from './task-time-api.service';

describe('TaskTimeApiService', () => {
  let service: TaskTimeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTimeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
