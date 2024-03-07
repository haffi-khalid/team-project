import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuthentication } from '../authentication.model';

@Component({
  selector: 'jhi-authentication-detail',
  templateUrl: './authentication-detail.component.html',
})
export class AuthenticationDetailComponent implements OnInit {
  authentication: IAuthentication | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ authentication }) => {
      this.authentication = authentication;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
