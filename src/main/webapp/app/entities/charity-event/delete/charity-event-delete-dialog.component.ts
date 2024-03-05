import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharityEvent } from '../charity-event.model';
import { CharityEventService } from '../service/charity-event.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './charity-event-delete-dialog.component.html',
})
export class CharityEventDeleteDialogComponent {
  charityEvent?: ICharityEvent;

  constructor(protected charityEventService: CharityEventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.charityEventService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
