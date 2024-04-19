import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharityHubUser } from '../charity-hub-user.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-charity-hub-user-detail',
  templateUrl: './charity-hub-user-detail.component.html',
})
export class CharityHubUserDetailComponent implements OnInit {
  charityHubUser: ICharityHubUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected dataUtils: DataUtils) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityHubUser }) => {
      this.charityHubUser = charityHubUser;
    });
  }

  previousState(): void {
    window.history.back();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }
}
