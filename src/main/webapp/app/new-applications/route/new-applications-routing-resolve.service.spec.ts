import { TestBed } from '@angular/core/testing';

import { NewApplicationsRoutingResolveService } from './new-applications-routing-resolve.service';

describe('NewApplicationsRoutingService', () => {
  let service: NewApplicationsRoutingResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewApplicationsRoutingResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
