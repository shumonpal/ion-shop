import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { NgEventBus } from 'ng-event-bus';
import { LOGIN } from 'src/app/constants/ErrorMessage';
import { AuthService } from 'src/app/providers/auth.service';
import { HelperService } from 'src/app/providers/helper.service';
import { UtilityService } from 'src/app/providers/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  credetialErr: boolean= false;
  initErrorFormMsg: any = {
    email: '',
    password: ''
  };
  validationMsg: any = LOGIN;

  constructor(
    private helper: HelperService,
    private auth: AuthService,
    private nvC: NavController,
    private eventBus: NgEventBus,
    private util: UtilityService,
  ) {
    // this.createForm()
   }

  ngOnInit() {
    this.createForm();
  }
  
  createForm(){
    this.loginForm = new FormGroup({
          email:   new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
        });
      this.loginForm.valueChanges.subscribe((data) => {
        this.initErrorFormMsg = this.helper.formValidationMsg(this.loginForm, this.validationMsg, this.initErrorFormMsg)
        
      });
  }

  submitLoginForm(){
    // const credentials = {
    //   email: this.loginForm.controls.email.value,
    //   password: this.loginForm.controls.password.value,
    // }
    this.auth.login(this.loginForm.value).subscribe((res) => {  
        console.log("loginpage", res);    
        this.eventBus.cast('loggedIn', true)
        
        this.nvC.back(); 
                
    }, (err) => {
      this.credetialErr = true;
      this.loginForm.reset();
      this.util.defaultToast("Sorry Your given cridentials is invalid");
    })
  }

}
