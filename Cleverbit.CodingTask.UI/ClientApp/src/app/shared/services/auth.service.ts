import { AuthResult, User } from './../models/User';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url = environment.apiUrl;
  private readonly controllerName = "user";
  private readonly authenticateAction = "authenticate"

  private currentuser_subject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  
  get CurrentUser$ () {
    return this.currentuser_subject.asObservable();
  }

  get CurrentUserValue() {
    return this.currentuser_subject.value;
  }

  constructor(private http: HttpClient) { 
    this.GetUserFromStorage();
  }

  public SignIn(username: string, password: string) {

    var data = {
      userName: username,
      password: password
    }
    var fullurl = this.url + "/" + this.controllerName + "/" + this.authenticateAction;

    return this.http.post<AuthResult>(fullurl, data)
            .pipe(map(result => {
              localStorage.setItem('currentUser', JSON.stringify(result.userData));
              this.currentuser_subject.next(result.userData);
              return result;
            }));
  }

  public SignOut() {
    localStorage.removeItem("currentUser");
    this.currentuser_subject.next(null);
  }

  private GetUserFromStorage() {
    let token = localStorage.getItem("currentUser");
    if (token)
    {
      let currentUser = JSON.parse(token) as User;
      return this.currentuser_subject.next(currentUser);
    }
    else {
      return this.currentuser_subject.next(null);
    }
  }
}
