import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVolunteerApplications } from '../volunteer-applications.model';

@Component({
  selector: 'jhi-volunteer-applications-detail',
  templateUrl: './volunteer-applications-detail.component.html',
})
export class VolunteerApplicationsDetailComponent implements OnInit {
  volunteerApplications: IVolunteerApplications | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ volunteerApplications }) => {
      this.volunteerApplications = volunteerApplications;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
