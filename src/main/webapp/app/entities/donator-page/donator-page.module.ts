import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DonatorPageComponent } from './list/donator-page.component';
import { DonatorPageDetailComponent } from './detail/donator-page-detail.component';
import { DonatorPageUpdateComponent } from './update/donator-page-update.component';
import { DonatorPageDeleteDialogComponent } from './delete/donator-page-delete-dialog.component';
import { DonatorPageRoutingModule } from './route/donator-page-routing.module';

@NgModule({
  imports: [SharedModule, DonatorPageRoutingModule],
  declarations: [DonatorPageComponent, DonatorPageDetailComponent, DonatorPageUpdateComponent, DonatorPageDeleteDialogComponent],
})
export class DonatorPageModule {}
