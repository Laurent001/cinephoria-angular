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
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { AuthService } from '../auth/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { UtilsService } from '../utils/utils.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonSegment,
    IonSegmentButton,
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
  currentView = 'login';

  // Login form
  loginEmail: string = 'email.laurent@gmail.com';
  loginPassword: string = 'laurent';

  // Register form
  registerFirstName: string = '';
  registerLastName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {}

  login(email: string, password: string) {
    this.loginService.login(email, password).subscribe({
      next: (data) => {
        this.authService.setUser(data.user);
        this.authService.setToken(data.token);
        this.router.navigate(['/home']);
        this.utilsService.presentAlert('Vous êtes désormais connecté');
      },
      error: (error) => {
        console.error('Login error', error);
        if (error.status === 404 || error.status === 401) {
          this.utilsService.presentAlert('Identifiants invalides');
        } else {
          this.utilsService.presentAlert(
            'Une erreur est survenue lors de la connexion'
          );
        }
      },
    });
  }

  register() {
    this.loginService
      .register(
        this.registerEmail,
        this.registerPassword,
        this.registerFirstName,
        this.registerLastName
      )
      .subscribe({
        next: (response) => {
          this.login(this.registerEmail, this.registerPassword);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Registration error', error);
          this.utilsService.presentAlert(
            "Une erreur pendant l'enregistrement s'est produite"
          );
        },
      });
  }

  resetPassword() {
    console.log('reset password for: ', this.loginEmail);
  }
}
