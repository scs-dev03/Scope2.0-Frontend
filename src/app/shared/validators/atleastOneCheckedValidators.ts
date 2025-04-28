import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator to ensure at least one checkbox is selected
export function atLeastOneCheckedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const values = control.value;
        // Check if at least one checkbox is selected (value === true)
        const hasChecked = Object.values(values).some(val => val === true);
        return hasChecked ? null : { atLeastOneRequired: true };
      };
}
