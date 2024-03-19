import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'charity-hub-user',
        data: { pageTitle: 'CharityHubUsers' },
        loadChildren: () => import('./charity-hub-user/charity-hub-user.module').then(m => m.CharityHubUserModule),
      },
      {
        path: 'user-page',
        data: { pageTitle: 'UserPages' },
        loadChildren: () => import('./user-page/user-page.module').then(m => m.UserPageModule),
      },
      {
        path: 'review-comments',
        data: { pageTitle: 'ReviewComments' },
        loadChildren: () => import('./review-comments/review-comments.module').then(m => m.ReviewCommentsModule),
      },
      {
        path: 'volunteer-applications',
        data: { pageTitle: 'VolunteerApplications' },
        loadChildren: () => import('./volunteer-applications/volunteer-applications.module').then(m => m.VolunteerApplicationsModule),
      },
      {
        path: 'social-feed',
        data: { pageTitle: 'SocialFeeds' },
        loadChildren: () => import('./social-feed/social-feed.module').then(m => m.SocialFeedModule),
      },
      {
        path: 'posts',
        data: { pageTitle: 'Posts' },
        loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule),
      },
      {
        path: 'group-donator',
        data: { pageTitle: 'GroupDonators' },
        loadChildren: () => import('./group-donator/group-donator.module').then(m => m.GroupDonatorModule),
      },
      {
        path: 'charity-profile',
        data: { pageTitle: 'CharityProfiles' },
        loadChildren: () => import('./charity-profile/charity-profile.module').then(m => m.CharityProfileModule),
      },
      {
        path: 'charity-admin',
        data: { pageTitle: 'CharityAdmins' },
        loadChildren: () => import('./charity-admin/charity-admin.module').then(m => m.CharityAdminModule),
      },
      {
        path: 'donator-page',
        data: { pageTitle: 'DonatorPages' },
        loadChildren: () => import('./donator-page/donator-page.module').then(m => m.DonatorPageModule),
      },
      {
        path: 'charity-event',
        data: { pageTitle: 'CharityEvents' },
        loadChildren: () => import('./charity-event/charity-event.module').then(m => m.CharityEventModule),
      },
      {
        path: 'fundraising-idea',
        data: { pageTitle: 'FundraisingIdeas' },
        loadChildren: () => import('./fundraising-idea/fundraising-idea.module').then(m => m.FundraisingIdeaModule),
      },
      {
        path: 'vacancies',
        data: { pageTitle: 'Vacancies' },
        loadChildren: () => import('./vacancies/vacancies.module').then(m => m.VacanciesModule),
      },
      {
        path: 'budget-planner',
        data: { pageTitle: 'BudgetPlanners' },
        loadChildren: () => import('./budget-planner/budget-planner.module').then(m => m.BudgetPlannerModule),
      },
      {
        path: 'approved-volunteers',
        data: { pageTitle: 'ApprovedVolunteers' },
        loadChildren: () => import('./approved-volunteers/approved-volunteers.module').then(m => m.ApprovedVolunteersModule),
      },
      {
        path: 'authentication',
        data: { pageTitle: 'Authentications' },
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
      },
      {
        path: 'group-donator-collector',
        data: { pageTitle: 'GroupDonatorCollectors' },
        loadChildren: () => import('./group-donator-collector/group-donator-collector.module').then(m => m.GroupDonatorCollectorModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
