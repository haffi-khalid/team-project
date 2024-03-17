import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../core/auth/account.service';
import { IVacancies } from '../entities/vacancies/vacancies.model';
import { VacanciesService } from '../entities/vacancies/service/vacancies.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'jhi-login-pop-up-check',
  templateUrl: './login-pop-up-check.component.html',
  styleUrls: ['./login-pop-up-check.component.scss'],
})
export class LoginPopUpCheckComponent implements OnInit {
  vacancies?: IVacancies;
  constructor(
    protected activeModal: NgbActiveModal,
    protected accountService: AccountService,
    private router: Router,
    protected vacanciesService: VacanciesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}
  cancel(): void {
    this.activeModal.dismiss();
  }
  login() {
    this.router.navigate(['/login']);
    this.activeModal.dismiss();
  }

  apply(vacancy: IVacancies | undefined) {
    // this.route.params.subscribe(object=>this.vacancies=object['vacancy'])
    this.router.navigate(['/volunteer-applications/new/vacancy', vacancy?.id]);
    this.activeModal.dismiss();
  }
}
