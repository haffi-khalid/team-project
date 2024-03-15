import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserPageComponent } from './list/user-page.component';
import { UserPageDetailComponent } from './detail/user-page-detail.component';
import { UserPageUpdateComponent } from './update/user-page-update.component';
import { UserPageDeleteDialogComponent } from './delete/user-page-delete-dialog.component';
import { UserPageRoutingModule } from './route/user-page-routing.module';

@NgModule({
  imports: [SharedModule, UserPageRoutingModule],
  declarations: [UserPageComponent, UserPageDetailComponent, UserPageUpdateComponent, UserPageDeleteDialogComponent],
  exports: [UserPageUpdateComponent, UserPageComponent, UserPageDetailComponent, UserPageDeleteDialogComponent],
})
export class UserPageModule {}
