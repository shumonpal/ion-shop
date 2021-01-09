import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EDITADDRESSFORM } from 'src/app/constants/ErrorMessage';
import { AuthService } from 'src/app/providers/auth.service';
import { HelperService } from 'src/app/providers/helper.service';
import { UtilityService } from 'src/app/providers/utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  editAddressForm: FormGroup;
  initErrorFormMsg: any = {
    country: '',
    state: '',
    address: '',
    phone: ''
  };
  validationMsg: any = EDITADDRESSFORM;
  isEdit:boolean = false;

  user:object = {};

  constructor(
    private auth: AuthService,
    private helper: HelperService,
    private util: UtilityService,

  ) { 
    this.auth.user().then((user) => {
      this.user = user
      // console.log("UserPPage", user);      
    });
  }

  ngOnInit() {
  }

  initEditAddressForm(){
    this.editAddressForm = new FormGroup({
      country: new FormControl('', [Validators.required, Validators.maxLength(15)]),
      state: new FormControl('',[Validators.required, Validators.maxLength(30)]),
      address: new FormControl('',[Validators.required, Validators.maxLength(100)]),
      phone: new FormControl('',[Validators.required, Validators.maxLength(20)]),
    });
    this.editAddressForm.valueChanges.subscribe((data) => {
      this.initErrorFormMsg = this.helper.formValidationMsg(this.editAddressForm, this.validationMsg, this.initErrorFormMsg)
      
    });
    this.setEditAddressFormValue();
    
  }

  async onClickEdit(){
    await this.initEditAddressForm();
    this.isEdit = true;
  }
  cancelEdit(){
    this.editAddressForm.reset();
    this.isEdit = false;
  }

  setEditAddressFormValue(){
    for (let key in this.editAddressForm.controls) {
      this.editAddressForm.controls[key].setValue(this.user[key]);      
    }
  }
  onSubmitEditAddressForm(){
    
    this.auth.update(this.user['id'], this.editAddressForm.value).then((user) => {
      console.log("this.editAddressForm.controls", user);
      this.user = user;
      this.isEdit = false;
      
    }).catch((err) => {
      this.util.defaultToast(err.error);
    });
  }


}
