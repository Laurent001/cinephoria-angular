import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../utils/utils.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
})
export class LoginComponent {
  currentView = 'login';

  // Login form
  loginEmail: string = '';
  loginPassword: string = '';

  // Register form
  registerFirstName: string = '';
  registerLastName: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerRole: string = 'user';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('fr');
  }

  login(email: string, password: string) {
    this.loginService.login(email, password).subscribe({
      next: (data) => {
        this.authService.setUser(data.user);
        this.authService.setToken(data.token);
        this.router.navigate(['/home']);
        this.utilsService.presentAlert('info', 'Vous êtes désormais connecté', [
          'OK',
          'success',
        ]);
      },
      error: (error) => {
        console.error('Login error', error);
        if (error.status === 404 || error.status === 401) {
          this.utilsService.presentAlert(
            'Attention',
            'Identifiants invalides',
            ['OK'],
            'error'
          );
        } else {
          this.utilsService.presentAlert(
            'Attention',
            'Une erreur est survenue lors de la connexion',
            ['OK'],
            'error'
          );
        }
      },
    });
  }

  register(role?: string) {
    if (role) {
      this.registerRole = role;
    }

    this.loginService
      .register(
        this.registerEmail,
        this.registerPassword,
        this.registerFirstName,
        this.registerLastName,
        this.registerRole
      )
      .subscribe({
        next: (response) => {
          this.login(this.registerEmail, this.registerPassword);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Registration error', error);
          this.utilsService.presentAlert(
            'Attention',
            "Une erreur pendant l'enregistrement s'est produite",
            ['OK'],
            'error'
          );
        },
      });
  }

  resetPassword() {
    this.router.navigate(['/password-reset-request']);
  }
}
