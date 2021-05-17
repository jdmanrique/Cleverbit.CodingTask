import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, public homeService: HomeService) {
  }

  ngOnInit(): void {
    this.homeService.GetExpiredMatches().subscribe();

    if (this.auth.CurrentUserValue)
    {
      this.homeService.GetActiveMatch().subscribe();
    }
  }

  SignOut() {
    this.auth.SignOut();
  }

  Play() {
    this.homeService.AddUserMatch().subscribe(result => {
      if (result) {
        alert("Thanks for participating in this match.");
      }
    });
  }

}
