import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { NgEventBus } from 'ng-event-bus';
import { REGISTRATION } from 'src/app/constants/ErrorMessage';
import { AuthService } from 'src/app/providers/auth.service';
import { HelperService } from 'src/app/providers/helper.service';
import { UtilityService } from 'src/app/providers/utility.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  regiForm: FormGroup;
  credetialErr: boolean = false;
  initErrorFormMsg: any = {
    name: '',
    email: '',
    password: ''
  };
  validationMsg: any = REGISTRATION;

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
    this.regiForm = new FormGroup({
          name:   new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
          email:   new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
        });
      this.regiForm.valueChanges.subscribe((data) => {
        this.initErrorFormMsg = this.helper.formValidationMsg(this.regiForm, this.validationMsg, this.initErrorFormMsg)
        
      });
  }

  submitregiForm(){
    // const credentials = {
    //   name: this.regiForm.controls.name.value,
    //   email: this.regiForm.controls.email.value,
    //   password: this.regiForm.controls.password.value,
    // }
    this.auth.registration(this.regiForm.value).subscribe((res) => {  
        this.eventBus.cast('loggedIn', true)        
        this.nvC.back(); 
                
    }, (err) => {
      this.credetialErr = true;
      this.regiForm.reset();
      this.util.defaultToast("Sorry Your given cridentials is invalid");
    })
  }

}
