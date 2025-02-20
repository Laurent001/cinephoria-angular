import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../utils/utils.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
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
        this.utilsService.presentAlert(
          'Attention',
          'Vous êtes désormais connecté',
          ['OK']
        );
      },
      error: (error) => {
        console.error('Login error', error);
        if (error.status === 404 || error.status === 401) {
          this.utilsService.presentAlert(
            'Attention',
            'Identifiants invalides',
            ['OK']
          );
        } else {
          this.utilsService.presentAlert(
            'Attention',
            'Une erreur est survenue lors de la connexion',
            ['OK']
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
            'Attention',
            "Une erreur pendant l'enregistrement s'est produite",
            ['OK']
          );
        },
      });
  }

  resetPassword() {
    console.log('reset password for: ', this.loginEmail);
  }
}
