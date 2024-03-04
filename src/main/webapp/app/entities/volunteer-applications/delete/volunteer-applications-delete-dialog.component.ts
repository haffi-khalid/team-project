import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVolunteerApplications } from '../volunteer-applications.model';
import { VolunteerApplicationsService } from '../service/volunteer-applications.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './volunteer-applications-delete-dialog.component.html',
})
export class VolunteerApplicationsDeleteDialogComponent {
  volunteerApplications?: IVolunteerApplications;

  constructor(protected volunteerApplicationsService: VolunteerApplicationsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.volunteerApplicationsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
