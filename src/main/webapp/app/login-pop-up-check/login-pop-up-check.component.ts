import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../core/auth/account.service';

@Component({
  selector: 'jhi-login-pop-up-check',
  templateUrl: './login-pop-up-check.component.html',
  styleUrls: ['./login-pop-up-check.component.scss'],
})
export class LoginPopUpCheckComponent implements OnInit {
  constructor(protected activeModal: NgbActiveModal, protected accountService: AccountService) {}

  ngOnInit(): void {}
  cancel(): void {
    this.activeModal.dismiss();
  }
}
