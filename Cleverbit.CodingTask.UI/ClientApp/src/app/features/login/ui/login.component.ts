import { AuthResult } from './../../../shared/models/User';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  AuthResult: AuthResult;
  form: FormGroup = this.fb.group({
    userName: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  Submit() {
    if (this.form.valid) {
      let username = this.form.get("userName")?.value;
      let password = this.form.get("password")?.value;

      this.authenticate(username, password);
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  private authenticate(username: string, password: string) {
    this.authService.SignIn(username, password).subscribe(
      result => {
        if (result.isAuthenticated)
        {
          this.router.navigate(['/']);
        }
      },
      error => {
        this.AuthResult = error.error;
      }
    )
  }
}
