import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CharityProfileComponent } from './list/charity-profile.component';
import { CharityProfileDetailComponent } from './detail/charity-profile-detail.component';
import { CharityProfileUpdateComponent } from './update/charity-profile-update.component';
import { CharityProfileDeleteDialogComponent } from './delete/charity-profile-delete-dialog.component';
import { CharityProfileRoutingModule } from './route/charity-profile-routing.module';

@NgModule({
  imports: [SharedModule, CharityProfileRoutingModule],
  declarations: [
    CharityProfileComponent,
    CharityProfileDetailComponent,
    CharityProfileUpdateComponent,
    CharityProfileDeleteDialogComponent,
  ],
})
export class CharityProfileModule {}
