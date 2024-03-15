import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopUpCheckComponent } from './login-pop-up-check.component';

describe('LoginPopUpCheckComponent', () => {
  let component: LoginPopUpCheckComponent;
  let fixture: ComponentFixture<LoginPopUpCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPopUpCheckComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPopUpCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
