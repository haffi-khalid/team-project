import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharityAdmin } from '../charity-admin.model';

@Component({
  selector: 'jhi-charity-admin-detail',
  templateUrl: './charity-admin-detail.component.html',
})
export class CharityAdminDetailComponent implements OnInit {
  charityAdmin: ICharityAdmin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityAdmin }) => {
      this.charityAdmin = charityAdmin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
