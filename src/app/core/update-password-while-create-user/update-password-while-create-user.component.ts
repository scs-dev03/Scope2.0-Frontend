import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PrimengModuleModule } from '../../shared/primeng-module/primeng-module.module';
import { SharedModule } from '../../shared/shared.module';
import { SHARED_IMPORTS } from '../../shared/shared-imports/shared-module';
import { GlobalBlockUiService } from '../../services/global-block-ui.service';

@Component({
  selector: 'app-update-password-while-create-user',
  imports: [PrimengModuleModule,SharedModule,SHARED_IMPORTS],
  templateUrl: './update-password-while-create-user.component.html',
  styleUrl: './update-password-while-create-user.component.css'
})
export class UpdatePasswordWhileCreateUserComponent {

  email:any;
  password:any;
  isLoading:boolean=false;
  qrCodeUrl:any;
  isSubmitted:boolean=false;
  OTP:any;
  secretKey:any;
  passwordMessage:any;
  emailMessage:any;
  emailArray:any=[];
  userName:any;
  updateForm:FormGroup;
  isOtpVerified:boolean=false;
  expiryTime: any;
  private timeoutId: any;
  emailFromRoute:any;
  isLinkValid: boolean=true;
  name:any;
  link:any;
  timeLeft: number = 300; // 5 minutes in seconds
  timer: any;
  minutes: number = 5;
  seconds: number = 0;
  constructor(private authService:AuthService,private messageService:MessageService,private router:Router,
    private fb:FormBuilder,private activatedRoute:ActivatedRoute,
  private userService:UserService,
private globalBlockUiService:GlobalBlockUiService){
    this.updateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      OTP: ['', Validators.required],
    });
    
   
  }

  ngOnInit(){
    this.activatedRoute.queryParams.subscribe(params => {
      let expiryParam=params['expiry']
      this.expiryTime = parseInt(params['expiry'], 10);
      this.checkLinkValidity();
      this.startTimer();
      if(expiryParam){
        const decodedExpiryParam = decodeURIComponent(expiryParam);
        const emailMatch = decodedExpiryParam.match(/email=([^\?&]+)/);
          const userNameMatch = decodedExpiryParam.match(/userName=([^\?&]+)/);
  
          if (emailMatch && emailMatch[1]) {
            this.emailFromRoute = emailMatch[1];
          }
  
          if (userNameMatch && userNameMatch[1]) {
            this.name = userNameMatch[1];
          }
        }
      //  console.log("email ",this.emailFromRoute,this.name)
      
    });
    if(this.email!=''){

      this.authService.checkEmail({email:this.email}).subscribe(
        (response) => {
          this.emailArray=response.data;
         // console.log(this.emailArray)
        },
        (error) => {
         
        }
      );
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--; // Decrease the time by 1 second
      this.minutes = Math.floor(this.timeLeft / 60); // Get the minutes
      this.seconds = this.timeLeft % 60; // Get the seconds

      if (this.timeLeft <= 0) {
        this.isLinkValid=false;
        clearInterval(this.timer); // Stop the timer when it reaches 0
        // Add logic for when the timer finishes (e.g., navigate to a different page)
      }
    }, 1000); // 1000ms = 1 second
  }
  checkLinkValidity() {
    // const currentTime = Date.now();
    // if (this.expiryTime && currentTime <= this.expiryTime) {
    //   this.isLinkValid = true;
    // } else {
    //   this.isLinkValid = false;
    // }

    const currentTime = Date.now();
    
    // If the link is valid (not expired yet), refresh the page after 15 minutes
    if (this.expiryTime && currentTime <= this.expiryTime) {
      this.isLinkValid = true;
      const timeLeft = this.expiryTime - currentTime;

      // Set a timeout to refresh the page after the remaining time (15 minutes)
      this.timeoutId = setTimeout(() => {
        window.location.reload();  // This will refresh the page
      }, timeLeft);
    } else {
     this.isLinkValid = false;
     
    }
  }

  ngOnDestroy() {
    // Clear the timeout if the component is destroyed before 15 minutes
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  validPassword(){
    this.passwordMessage=''
    let nameExist=false;
    if(this.updateForm.value.password.toLowerCase().includes(this.userName.replace(/\s/g, '').toLowerCase())){
     // console.log("password ",this.updateForm.value.password,this.userName)
      this.passwordMessage='your user name does not contains in password';
      nameExist=true;
    }
let password=this.updateForm.value.password
    if (password.length < 8 || password.length > 16) {
      this.passwordMessage+= "Password must be between 8 and 16 characters.";
    }
    if (!/[A-Z]/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one digit.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.passwordMessage+=  "Password must contain at least one special character.";
    }
    if (/\s/.test(password)) {
      this.passwordMessage+=  "Password must not contain spaces.";
    }

    return "Password is valid.";

  }

  checkEmailAvailability() {
    this.emailMessage = '';

    // Loop through the email array to check if the entered email exists
    let emailExists = false;
    
    this.emailArray.forEach((item: any) => {
      // Check if the email exists in the array
      if (item.vcEmail === this.updateForm.value.email) {
        this.emailMessage = '';
        this.userName=item.name
        emailExists = true; // Email found, set flag to true
        // console.log(item.emailId, this.updateForm.value.email, this.emailMessage);
      }
    });
  
    // If email is not found in the array, update the message
    if (!emailExists && this.updateForm.value.email) {
      this.emailMessage = 'User does not exist. Enter a valid email!';
      // console.log(this.emailMessage);
    }
   
  }

  verifyOTP(){
    
    if(this.updateForm.value.OTP!=''){
      this.globalBlockUiService.startLoading();;
      this.authService.twoFactorAuthentication({token:this.updateForm.value.OTP,secret:this.secretKey}).subscribe( (response) => {
        // this.messageService.add({severity:'success',life:300000,summary:'Invalid OTP',detail:'Try Again!!'})
         this.globalBlockUiService.stopLoading();;
        this.isOtpVerified=true;
        this.messageService.add({severity:'success',life:3000,summary:'Your OTP has been verified succesfully!!',detail:'You can submit now!!'})
              //this.router.navigate(['/dashboard']);
              // this.OTP=''
        // alert('2FA verified successfully!');
      },
      (error) => {
        this.globalBlockUiService.stopLoading();;
        this.OTP=''
        this.messageService.add({severity:'error',life:30000,summary:'Invalid OTP',detail:'Try re-scanning QR Code Again!!'})
        // alert('Invalid OTP');
      })
    }
    else{
      Object.keys(this.updateForm.controls).forEach((controlName:any)=>{
        this.updateForm.get(controlName)?.markAsTouched()
      })
    }
  }

  googleAuth(){
    
    this.globalBlockUiService.startLoading();;
    this.authService.generateQR().subscribe((res:any)=>{
      this.qrCodeUrl=res.qr;
      this.secretKey=res.secret;
      this.globalBlockUiService.stopLoading();;
    },(error:any)=>{
      this.messageService.add({severity:'error',life:100000,summary:'Error in processing for Google Authenticator'})
    })
  }

  submit(){

    if(!this.isOtpVerified && this.updateForm.valid){
      this.messageService.add({severity:'error',life:30000,summary:'Kindly do the Authentication  !!!'})
      return;
    }
    if(this.updateForm.valid && this.emailMessage=='' && this.passwordMessage==''){
      this.globalBlockUiService.startLoading();;
      let data={
        email:this.updateForm.value.email,
        password:this.updateForm.value.password,
        secretKey:this.secretKey,
      }
    //  console.log("submit ",data)
      this.authService.updatePasswordWhileCreatingUser(data).subscribe((res:any)=>{
        this.globalBlockUiService.stopLoading();;
        this.messageService.add({severity:'success',life:30000,summary:'Your Password has been created succesfully!!',detail:'You can Login now!!'})
        // let link='http://103.30.72.109/login'
        let link="http://web17.185.238.new.ocpwebserver.com/login";
        this.updateForm.reset();
        window.open(link, '_blank');
          this.isSubmitted=true;
      },(error:any)=>{
        this.globalBlockUiService.stopLoading();;
        this.updateForm.reset();
        
      })
    }
    else{
      Object.keys(this.updateForm.controls).forEach((controlName)=>{
        this.updateForm.get(controlName)?.markAsTouched();
      })
    }
  }

  requestNewLink() {

   // this.link="http://103.30.72.109/update-user-password";
    // this.link="http://localhost:4200/core/update-user-password";
    this.link="http://web17.185.238.new.ocpwebserver.com/core/update-user-password";
    this.userService.requestNewMail({userName:this.name,email:this.emailFromRoute,link:this.link}).subscribe((res:any)=>{
      this.messageService.add({severity:'success',summary:'Check your mail for updating the password',life:3000});
    },(error:any)=>{
      this.messageService.add({severity:'error',summary:'Error in requesting for new link',life:30000});
    })
   
}
}
