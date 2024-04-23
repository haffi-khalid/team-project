// import { NgModule } from '@angular/core';
// import { SharedModule } from 'app/shared/shared.module';
// import { ReviewCommentsComponent } from './list/review-comments.component';
// import { ReviewCommentsDetailComponent } from './detail/review-comments-detail.component';
// import { ReviewCommentsUpdateComponent } from './update/review-comments-update.component';
// import { ReviewCommentsDeleteDialogComponent } from './delete/review-comments-delete-dialog.component';
// import { ReviewCommentsRoutingModule } from './route/review-comments-routing.module';
//
// @NgModule({
//   imports: [SharedModule, ReviewCommentsRoutingModule],
//   declarations: [
//     ReviewCommentsComponent,
//     ReviewCommentsDetailComponent,
//     ReviewCommentsUpdateComponent,
//     ReviewCommentsDeleteDialogComponent,
//   ],
// })
// export class ReviewCommentsModule {}
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReviewCommentsComponent } from './list/review-comments.component';
import { ReviewCommentsDetailComponent } from './detail/review-comments-detail.component';
import { ReviewCommentsUpdateComponent } from './update/review-comments-update.component';
import { ReviewCommentsDeleteDialogComponent } from './delete/review-comments-delete-dialog.component';
import { ReviewCommentsRoutingModule } from './route/review-comments-routing.module';

@NgModule({
  imports: [SharedModule, ReviewCommentsRoutingModule],
  declarations: [
    ReviewCommentsComponent,
    ReviewCommentsDetailComponent,
    ReviewCommentsUpdateComponent,
    ReviewCommentsDeleteDialogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ReviewCommentsComponent],
  // Add this line to your existing NgModule decorator
})
export class ReviewCommentsModule {}
