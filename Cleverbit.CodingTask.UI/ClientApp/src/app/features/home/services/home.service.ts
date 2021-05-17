import { map } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Match } from '../models/Match';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  private readonly url = environment.apiUrl;
  private readonly controllerName = "NumberGame";
  private readonly getExpiredMatchesAction = "GetExpiredMatches";
  private readonly getActiveMatchAction = "GetActiveMatch";
  private readonly addUserMatchAction = "AddUserMatch";

  private expiredmatches_subject: BehaviorSubject<Match[]> = new BehaviorSubject<Match[]>([]);
  private activematch_subject: BehaviorSubject<Match> = new BehaviorSubject<Match>(null);
  private addusermatch_subjet: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public ExpiredMatches$ = this.expiredmatches_subject.asObservable();
  public ActiveMatch$ = this.activematch_subject.asObservable();
  public AddUserMatch$ = this.addusermatch_subjet.asObservable();

  constructor(private httpClient: HttpClient, private authService: AuthService) { 

  }

  public GetExpiredMatches() {
    let fullurl = this.url + "/" + this.controllerName + "/" + this.getExpiredMatchesAction;
    return this.httpClient.get<Match[]>(fullurl)
      .pipe(map(result => {
        this.expiredmatches_subject.next(result);
        return result;
      }));
  }

  public GetActiveMatch() {
    let user = this.authService.CurrentUserValue;
    let fullurl = this.url + "/" + this.controllerName + "/" + this.getActiveMatchAction;
    return this.httpClient.get<Match>(fullurl,{ params: {userId: user.id}})
      .pipe(map(result => {
        this.activematch_subject.next(result);
        return result;
      }));
  }

  public AddUserMatch() {
    let fullurl = this.url + "/" + this.controllerName + "/" + this.addUserMatchAction;
    let user = this.authService.CurrentUserValue;

    return this.httpClient.post<number>(fullurl,user.id)
      .pipe(map(numberinput => {
        let activematch = this.activematch_subject.value;
        activematch.numberInput = numberinput;
        
        this.activematch_subject.next(activematch);
        this.addusermatch_subjet.next(numberinput);
        return numberinput;
      }));
  }


}
