import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  formValidationMsg(formObj, validationMsg, initErrorFormMsg){
    for (let field in initErrorFormMsg) {
      initErrorFormMsg[field] = '';
      const element = formObj.controls[field];
      if (element && element.invalid && element.dirty) {
        const msgObj = validationMsg[field];
        for (let key in element.errors) {
          initErrorFormMsg[field] = msgObj[key]
          
        }
      }
      
    }
    return initErrorFormMsg;
  }

  matchPassword(password, confirmPassword) {
    if (password.dirty && confirmPassword.dirty) {
      if (password.value !== confirmPassword.value) {
        return true;
      }else{
        return false;
      }
    }
  }
}