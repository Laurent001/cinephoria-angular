import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { User } from '../app';
import { AuthService } from '../auth/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonItem,
    IonList,
    IonLabel,
    IonContent,
    CommonModule,
    FormsModule,
    LayoutComponent,
  ],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  user: User | undefined;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    this.email = 'emp42@cine.com';
    this.password = 'password123';
  }

  ngOnInit() {}

  login() {
    this.loginService.setUserLogin(this.email, this.password).subscribe({
      next: (user: User) => {
        this.user = user;
        console.log('user : ', this.user);
        this.authService.setUser(this.user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error', error);
        alert('An error occurred during login');
      },
      complete: () => {
        console.log('Login request completed');
      },
    });
  }
}
