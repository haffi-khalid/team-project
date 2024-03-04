import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SocialFeedComponent } from './list/social-feed.component';
import { SocialFeedDetailComponent } from './detail/social-feed-detail.component';
import { SocialFeedUpdateComponent } from './update/social-feed-update.component';
import { SocialFeedDeleteDialogComponent } from './delete/social-feed-delete-dialog.component';
import { SocialFeedRoutingModule } from './route/social-feed-routing.module';

@NgModule({
  imports: [SharedModule, SocialFeedRoutingModule],
  declarations: [SocialFeedComponent, SocialFeedDetailComponent, SocialFeedUpdateComponent, SocialFeedDeleteDialogComponent],
})
export class SocialFeedModule {}
