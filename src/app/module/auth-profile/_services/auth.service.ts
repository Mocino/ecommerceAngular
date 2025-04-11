import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { User, AuthResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User | null = null;
  token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.getLocalStorage();
  }

  getLocalStorage(){
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    this.token = token ? token : null;
    this.user = user ? JSON.parse(user) as User : null;
  }

  login(email: string, password: string): Observable<boolean | AuthResponse> {
    const URL = URL_SERVICIOS + "users/login";
    return this.http.post<AuthResponse>(URL, {email, password}).pipe(
      map((resp: AuthResponse) => {
        if(resp.USER_FRONTED && resp.USER_FRONTED.token) {
          return this.localStorageSave(resp.USER_FRONTED);
        } else {
          return resp;
        }
      }),
      catchError((error: AuthResponse) => {
        console.log(error);
        return of(error);
      })
    );
  }

  localStorageSave(USER_FRONTED: {token: string, user: User}): boolean {
    localStorage.setItem("token", USER_FRONTED.token);
    localStorage.setItem("user", JSON.stringify(USER_FRONTED.user));
    this.token = USER_FRONTED.token;
    this.user = USER_FRONTED.user;
    return true;
  }

  registro(data:any){
    let URL = URL_SERVICIOS + "users/register";
    return this.http.post(URL,data);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.token = null;
    this.user = null;
    this.router.navigate(["auth/login"]);
  }
}
