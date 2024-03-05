import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApprovedVolunteers } from '../approved-volunteers.model';

@Component({
  selector: 'jhi-approved-volunteers-detail',
  templateUrl: './approved-volunteers-detail.component.html',
})
export class ApprovedVolunteersDetailComponent implements OnInit {
  approvedVolunteers: IApprovedVolunteers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ approvedVolunteers }) => {
      this.approvedVolunteers = approvedVolunteers;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
