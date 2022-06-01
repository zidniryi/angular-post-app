import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { retry, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | undefined;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Get the token
   * @returns {string}
   */
  getToken() {
    return this.token;
  }

  /**
   * get token handle on Init cause in nt handle good from anggular
   * @returns {boolean}
   */
  getIsAuth() {
    return this.isAuthenticated;
  }

  /**
   * Get status as obesrvable
   * @returns {Observable<boolean>}
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /**
   * Register user
   * @param email
   * @param password
   */
  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  /**
   * For login
   * @param email
   * @param password
   */
  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiredDuration = response.expiresIn;
          this.setAuthTimer(expiredDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiredDuration * 1000
          );
          this.setAuthData(token, expirationDate);
          console.log(expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * Check if the token is expired and register is token is valid
   * call in AppComponent
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (!authInformation) {
      return;
    }
    if (expiresIn > 0) {
      this.token = authInformation!.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /**
   * To logout the user
   */
  logout() {
    this.token = undefined;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Decouple the timer
   * @param expiredDuration number of seconds
   */
  private setAuthTimer(expiredDuration: number) {
    console.log(expiredDuration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiredDuration * 1000);
  }

  /**
   * Register new token and expired date to localStorage
   * @param token
   * @param expirationDate
   */
  private setAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  /**
   * Clear the token and expiration date from localStorage
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  /**
   * If the token or expiration date is not in localStorage, then return null
   * else register again
   * @returns {boolean}
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }
}
