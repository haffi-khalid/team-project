import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserPage } from '../user-page.model';

@Component({
  selector: 'jhi-user-page-detail',
  templateUrl: './user-page-detail.component.html',
})
export class UserPageDetailComponent implements OnInit {
  userPage: IUserPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPage }) => {
      this.userPage = userPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
