import { TestBed } from '@angular/core/testing';

import { OpinionsService } from './opinions.service';

describe('OpinionService', () => {
  let service: OpinionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpinionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
