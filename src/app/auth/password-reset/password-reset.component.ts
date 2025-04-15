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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsService } from 'src/app/utils/utils.service';
import { AuthService } from '../auth.service';
import { passwordValidator } from './password-validator';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
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
export class PasswordResetComponent {
  resetForm: FormGroup;
  token: string = '';
  minLength = 8;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,

    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          passwordValidator(this.minLength, true, true, true),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const newPassword = this.resetForm.value.password;

    this.authService.passwordReset(this.token, newPassword).subscribe({
      next: (response) => {
        this.utilsService.presentAlert(
          'Information',
          'Votre mot de passe a été changé avec succès.',
          ['OK'],
          'success'
        );
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.utilsService.presentAlert(
          'Information',
          "Une erreur s'est produite. Veuillez réessayer.",
          ['OK'],
          'error'
        );
        this.router.navigate(['/password-reset-request']);
      },
    });
  }
}
