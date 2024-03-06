import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharityEvent } from '../charity-event.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-charity-event-detail',
  templateUrl: './charity-event-detail.component.html',
})
export class CharityEventDetailComponent implements OnInit {
  charityEvent: ICharityEvent | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityEvent }) => {
      this.charityEvent = charityEvent;
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
