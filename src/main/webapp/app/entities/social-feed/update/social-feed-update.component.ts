import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SocialFeedFormService, SocialFeedFormGroup } from './social-feed-form.service';
import { ISocialFeed } from '../social-feed.model';
import { SocialFeedService } from '../service/social-feed.service';

@Component({
  selector: 'jhi-social-feed-update',
  templateUrl: './social-feed-update.component.html',
})
export class SocialFeedUpdateComponent implements OnInit {
  isSaving = false;
  socialFeed: ISocialFeed | null = null;

  editForm: SocialFeedFormGroup = this.socialFeedFormService.createSocialFeedFormGroup();

  constructor(
    protected socialFeedService: SocialFeedService,
    protected socialFeedFormService: SocialFeedFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socialFeed }) => {
      this.socialFeed = socialFeed;
      if (socialFeed) {
        this.updateForm(socialFeed);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const socialFeed = this.socialFeedFormService.getSocialFeed(this.editForm);
    if (socialFeed.id !== null) {
      this.subscribeToSaveResponse(this.socialFeedService.update(socialFeed));
    } else {
      this.subscribeToSaveResponse(this.socialFeedService.create(socialFeed));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISocialFeed>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(socialFeed: ISocialFeed): void {
    this.socialFeed = socialFeed;
    this.socialFeedFormService.resetForm(this.editForm, socialFeed);
  }
}
