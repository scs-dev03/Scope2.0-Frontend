import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
//   const isWhitespace = (control.value || '').toString().trim().length === 0;
//   return isWhitespace ? { whitespace: true } : null;
 const value = (control.value || '').toString().trim();

  if (!value) {
    return { required: true };
  }

  return null;
}