import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuthentication } from '../authentication.model';
import { AuthenticationService } from '../service/authentication.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './authentication-delete-dialog.component.html',
})
export class AuthenticationDeleteDialogComponent {
  authentication?: IAuthentication;

  constructor(protected authenticationService: AuthenticationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.authenticationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
