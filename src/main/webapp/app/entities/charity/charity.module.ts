import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CharityComponent } from './list/charity.component';
import { CharityDetailComponent } from './detail/charity-detail.component';
import { CharityUpdateComponent } from './update/charity-update.component';
import { CharityDeleteDialogComponent } from './delete/charity-delete-dialog.component';
import { CharityRoutingModule } from './route/charity-routing.module';

@NgModule({
  imports: [SharedModule, CharityRoutingModule],
  declarations: [CharityComponent, CharityDetailComponent, CharityUpdateComponent, CharityDeleteDialogComponent],
})
export class CharityModule {}
