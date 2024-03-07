import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVacancies } from '../vacancies.model';
import { VacanciesService } from '../service/vacancies.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vacancies-delete-dialog.component.html',
})
export class VacanciesDeleteDialogComponent {
  vacancies?: IVacancies;

  constructor(protected vacanciesService: VacanciesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vacanciesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
