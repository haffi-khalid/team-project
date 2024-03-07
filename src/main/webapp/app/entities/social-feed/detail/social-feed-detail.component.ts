import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISocialFeed } from '../social-feed.model';

@Component({
  selector: 'jhi-social-feed-detail',
  templateUrl: './social-feed-detail.component.html',
})
export class SocialFeedDetailComponent implements OnInit {
  socialFeed: ISocialFeed | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socialFeed }) => {
      this.socialFeed = socialFeed;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
