import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CharityEventComponent } from './list/charity-event.component';
import { CharityEventDetailComponent } from './detail/charity-event-detail.component';
import { CharityEventUpdateComponent } from './update/charity-event-update.component';
import { CharityEventDeleteDialogComponent } from './delete/charity-event-delete-dialog.component';
import { CharityEventRoutingModule } from './route/charity-event-routing.module';

@NgModule({
  imports: [SharedModule, CharityEventRoutingModule],
  declarations: [CharityEventComponent, CharityEventDetailComponent, CharityEventUpdateComponent, CharityEventDeleteDialogComponent],
})
export class CharityEventModule {}
