import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(
  minLength: number,
  requireUppercase: boolean,
  requireLowercase: boolean,
  requireSpecialChar: boolean
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.value as string;

    let errors: { [key: string]: any } = {};

    if (password.length < minLength) {
      errors['minLength'] = {
        requiredLength: minLength,
        actualLength: password.length,
      };
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors['requireUppercase'] = true;
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      errors['requireLowercase'] = true;
    }

    if (requireSpecialChar && !/[^a-zA-Z0-9]/.test(password)) {
      errors['requireSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
