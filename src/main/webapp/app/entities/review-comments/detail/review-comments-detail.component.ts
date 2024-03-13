import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReviewComments } from '../review-comments.model';

@Component({
  selector: 'jhi-review-comments-detail',
  templateUrl: './review-comments-detail.component.html',
})
export class ReviewCommentsDetailComponent implements OnInit {
  reviewComments: IReviewComments | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reviewComments }) => {
      this.reviewComments = reviewComments;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
