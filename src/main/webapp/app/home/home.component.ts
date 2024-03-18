import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentFocusIndex: number = 0; // Tracks the current focus index

  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToCharityProfile(charityId: string): void {
    // Navigates to the detail view of the charity profile with the given charity ID.
    this.router.navigate(['/charity-profile', charityId, 'view']);
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const containers = Array.from(document.querySelectorAll('.container6') as NodeListOf<HTMLElement>);

    // Prevent default action if it's one of the handled keys to stop scrolling
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === 'ArrowDown') {
      this.currentFocusIndex = (this.currentFocusIndex + 1) % containers.length;
      containers[this.currentFocusIndex].focus();
    } else if (event.key === 'ArrowUp') {
      this.currentFocusIndex = (this.currentFocusIndex - 1 + containers.length) % containers.length;
      containers[this.currentFocusIndex].focus();
    }
  }
}
