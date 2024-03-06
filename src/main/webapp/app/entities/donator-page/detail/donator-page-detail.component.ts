import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDonatorPage } from '../donator-page.model';

@Component({
  selector: 'jhi-donator-page-detail',
  templateUrl: './donator-page-detail.component.html',
})
export class DonatorPageDetailComponent implements OnInit {
  donatorPage: IDonatorPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donatorPage }) => {
      this.donatorPage = donatorPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
