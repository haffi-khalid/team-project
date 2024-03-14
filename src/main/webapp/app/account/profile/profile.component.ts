import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userPage: IUserPage | null = null;
  pageExists = false;
  constructor(private accountService: AccountService, private pageService: UserPageService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.pageService.find(account.id as number).subscribe(res => {
          if (res.body) {
            this.userPage = res.body;
            this.pageExists = true;
          }
        });
      }
    });
  }
}
