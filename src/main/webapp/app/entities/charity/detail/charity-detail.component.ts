import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharity } from '../charity.model';

@Component({
  selector: 'jhi-charity-detail',
  templateUrl: './charity-detail.component.html',
})
export class CharityDetailComponent implements OnInit {
  charity: ICharity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charity }) => {
      this.charity = charity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
