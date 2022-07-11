import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent implements OnInit {

  isLoading = false;
  error = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  onSignIn(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const rememberPassword = form.value.rememberPassword;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.login(email, password, rememberPassword);
  
    authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/item']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onSignUp(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const rememberPassword = form.value.rememberPassword;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    authObs = this.authService.signUp(email, password, rememberPassword);

    authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/item']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  forgetPassword() {
  }
}
