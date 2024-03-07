import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CharityHubUserComponent } from './list/charity-hub-user.component';
import { CharityHubUserDetailComponent } from './detail/charity-hub-user-detail.component';
import { CharityHubUserUpdateComponent } from './update/charity-hub-user-update.component';
import { CharityHubUserDeleteDialogComponent } from './delete/charity-hub-user-delete-dialog.component';
import { CharityHubUserRoutingModule } from './route/charity-hub-user-routing.module';

@NgModule({
  imports: [SharedModule, CharityHubUserRoutingModule],
  declarations: [
    CharityHubUserComponent,
    CharityHubUserDetailComponent,
    CharityHubUserUpdateComponent,
    CharityHubUserDeleteDialogComponent,
  ],
})
export class CharityHubUserModule {}
