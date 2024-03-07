import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonatorPage } from '../donator-page.model';
import { DonatorPageService } from '../service/donator-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './donator-page-delete-dialog.component.html',
})
export class DonatorPageDeleteDialogComponent {
  donatorPage?: IDonatorPage;

  constructor(protected donatorPageService: DonatorPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.donatorPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
