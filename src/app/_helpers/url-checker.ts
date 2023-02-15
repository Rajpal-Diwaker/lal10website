import { FormGroup } from '@angular/forms';

export function UrlChecker(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        
        if ( control.value.indexOf("http://")==-1 && control.value.indexOf("https://")==-1) {
            control.setErrors({ urlChecker: true });
        } else {
            control.setErrors(null);
        }
    }
}