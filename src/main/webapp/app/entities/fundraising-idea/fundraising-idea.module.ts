import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FundraisingIdeaComponent } from './list/fundraising-idea.component';
import { FundraisingIdeaDetailComponent } from './detail/fundraising-idea-detail.component';
import { FundraisingIdeaUpdateComponent } from './update/fundraising-idea-update.component';
import { FundraisingIdeaDeleteDialogComponent } from './delete/fundraising-idea-delete-dialog.component';
import { FundraisingIdeaRoutingModule } from './route/fundraising-idea-routing.module';

@NgModule({
  imports: [SharedModule, FundraisingIdeaRoutingModule],
  declarations: [
    FundraisingIdeaComponent,
    FundraisingIdeaDetailComponent,
    FundraisingIdeaUpdateComponent,
    FundraisingIdeaDeleteDialogComponent,
  ],
})
export class FundraisingIdeaModule {}
