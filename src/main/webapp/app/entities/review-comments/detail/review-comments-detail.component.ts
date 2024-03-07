import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReviewComments } from '../review-comments.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-review-comments-detail',
  templateUrl: './review-comments-detail.component.html',
})
export class ReviewCommentsDetailComponent implements OnInit {
  reviewComments: IReviewComments | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reviewComments }) => {
      this.reviewComments = reviewComments;
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
