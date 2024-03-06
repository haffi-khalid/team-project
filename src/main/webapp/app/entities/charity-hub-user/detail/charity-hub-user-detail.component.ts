import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharityHubUser } from '../charity-hub-user.model';

@Component({
  selector: 'jhi-charity-hub-user-detail',
  templateUrl: './charity-hub-user-detail.component.html',
})
export class CharityHubUserDetailComponent implements OnInit {
  charityHubUser: ICharityHubUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityHubUser }) => {
      this.charityHubUser = charityHubUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
