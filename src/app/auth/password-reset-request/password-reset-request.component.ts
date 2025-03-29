import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/utils/utils.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
  ],
})
export class PasswordResetRequestComponent {
  resetForm: FormGroup;
  message: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private utilsService: UtilsService
  ) {
    this.translate.setDefaultLang('fr');

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.resetForm.get('email');
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const email = this.resetForm.value.email;

    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.utilsService.presentAlert(
          'Information',
          'Un e-mail de réinitialisation de mot de passe a été envoyé.',
          ['OK'],
          'success'
        );
      },
      error: (error) => {
        this.utilsService.presentAlert(
          'Information',
          "Une erreur s'est produite. Veuillez réessayer.",
          ['OK'],
          'error'
        );
      },
    });
  }
}
