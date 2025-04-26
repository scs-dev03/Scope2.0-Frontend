import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';

@Component({
  selector: 'app-login-page',
  imports: [SHARED_IMPORTS],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  userLoginInputDetails : FormGroup = new FormGroup({
    userName: new FormControl(''),
    userPassword: new FormControl('')
  })
 

  onSubmit(){
    console.log(this.userLoginInputDetails)
  }
  
}
