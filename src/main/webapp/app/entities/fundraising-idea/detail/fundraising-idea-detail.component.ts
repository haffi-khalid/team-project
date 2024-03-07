import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFundraisingIdea } from '../fundraising-idea.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-fundraising-idea-detail',
  templateUrl: './fundraising-idea-detail.component.html',
})
export class FundraisingIdeaDetailComponent implements OnInit {
  fundraisingIdea: IFundraisingIdea | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fundraisingIdea }) => {
      this.fundraisingIdea = fundraisingIdea;
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
