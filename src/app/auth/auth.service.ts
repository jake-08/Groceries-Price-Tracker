import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { BehaviorSubject } from 'rxjs';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}  

@Injectable( {providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
  
    constructor(private http: HttpClient, private router: Router) {}
  
    signUp(email: string, password: string, rememberPassword: boolean) {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDecZ7AT2lglTHRTDAiBcljkpqw7xtWPT0',
          {
            email: email,
            password: password,
            returnSecureToken: true,
          }
        )
        .pipe(
          catchError(this.handdleError),
          tap((resData) => {
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn,
              rememberPassword
            );
          })
        );
    }
  
    login(email: string, password: string, rememberPassword: boolean) {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDecZ7AT2lglTHRTDAiBcljkpqw7xtWPT0',
          {
            email: email,
            password: password,
            returnSecureToken: true,
          }
        )
        .pipe(
          catchError(this.handdleError),
          tap((resData) => {
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn,
              rememberPassword
            );
          })
        );
    }
  
    logout() {
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
    }
  
    autoLogin() {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return;
      }
      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      if (loadedUser.token) {
        // Set the autoLogout timer if the expiration date is equals to today date
        if (new Date(userData._tokenExpirationDate).getDay() - new Date().getDay() == 0) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.autoLogout(expirationDuration);
        }
        this.user.next(loadedUser);
      }
    }
  
    autoLogout(expirationDuration: number) {
      console.log("Auto Logout in " + this.msToHrOrMin(expirationDuration));
      this.tokenExpirationTimer = setTimeout(() => {
        console.log("Logout from autologout")
        this.logout();
      }, expirationDuration);
    }
  
    private handleAuthentication(
      email: string,
      userId: string,
      token: string,
      expiresIn: number,
      rememberPassword: boolean
    ) {
      if (rememberPassword) {
        console.log("Remember for 30 days")
        const expirationDate = new Date(new Date().setDate(new Date().getDate() + 30)); // Set the expiration Date for 30 days 
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      } else {
        const expirationDate = new Date(new Date().setDate(new Date().getDate() + 1)); // Set the expiration Date for 1 day 
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      }
    
    }
  
    private msToHrOrMin(milliSeconds): string {
      let result = null;
      let hours = Math.floor(milliSeconds/(60 * 60 * 1000 ));
      if (hours == 0) {
        result = Math.floor(milliSeconds/(60 * 1000)) + " minutes.";
      } else {
        result = hours + " hours."
      }
      return result;
    }
  
    private handdleError(errorRes: HttpErrorResponse) {
      let errorMessage = 'An unknown error occured!';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(() => new Error(errorMessage));
      }
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = 'Too many attempts. Try again later.';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = "This email doesn't exist.";
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is incorrect.';
          break;
      }
      return throwError(() => new Error(errorMessage));
    }
  }