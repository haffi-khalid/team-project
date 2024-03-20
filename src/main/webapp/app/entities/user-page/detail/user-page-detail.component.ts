import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserPage } from '../user-page.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-user-page-detail',
  templateUrl: './user-page-detail.component.html',
  styleUrls: ['./user-page-detail.component.css'],
})
export class UserPageDetailComponent implements OnInit {
  userPage: IUserPage | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPage }) => {
      this.userPage = userPage;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
