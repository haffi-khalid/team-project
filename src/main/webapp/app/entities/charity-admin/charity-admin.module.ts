import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CharityAdminComponent } from './list/charity-admin.component';
import { CharityAdminDetailComponent } from './detail/charity-admin-detail.component';
import { CharityAdminUpdateComponent } from './update/charity-admin-update.component';
import { CharityAdminDeleteDialogComponent } from './delete/charity-admin-delete-dialog.component';
import { CharityAdminRoutingModule } from './route/charity-admin-routing.module';

@NgModule({
  imports: [SharedModule, CharityAdminRoutingModule],
  declarations: [CharityAdminComponent, CharityAdminDetailComponent, CharityAdminUpdateComponent, CharityAdminDeleteDialogComponent],
})
export class CharityAdminModule {}
