import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private toast: ToastController , private loader: LoadingController) { }


  async defaultToast(message){
      const toast = await this.toast.create({
        message: message,
        duration: 3000
      });
      toast.present();
  }

  // async pageLoading(){
  //   this.load = await this.loader.create({
  //     message: 'Please wait...'
  //   });
  //   return await this.load.present();
  // }
  async presentLoading() {
    await this.loader.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });
  }

  async hideLoading(){
    await this.loader.dismiss()
  }
}
