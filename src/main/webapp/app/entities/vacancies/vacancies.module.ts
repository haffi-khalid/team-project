import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VacanciesComponent } from './list/vacancies.component';
import { VacanciesDetailComponent } from './detail/vacancies-detail.component';
import { VacanciesUpdateComponent } from './update/vacancies-update.component';
import { VacanciesDeleteDialogComponent } from './delete/vacancies-delete-dialog.component';
import { VacanciesRoutingModule } from './route/vacancies-routing.module';

@NgModule({
  imports: [SharedModule, VacanciesRoutingModule],
  declarations: [VacanciesComponent, VacanciesDetailComponent, VacanciesUpdateComponent, VacanciesDeleteDialogComponent],
})
export class VacanciesModule {}
