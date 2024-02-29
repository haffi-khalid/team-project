import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-profile',
        data: { pageTitle: 'UserProfiles' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'Comments' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'charity',
        data: { pageTitle: 'Charities' },
        loadChildren: () => import('./charity/charity.module').then(m => m.CharityModule),
      },
      {
        path: 'social-feed',
        data: { pageTitle: 'SocialFeeds' },
        loadChildren: () => import('./social-feed/social-feed.module').then(m => m.SocialFeedModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'Posts' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'media',
        data: { pageTitle: 'Media' },
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
