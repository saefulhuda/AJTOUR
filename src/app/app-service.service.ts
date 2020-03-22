import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(public toastController: ToastController, public alertCtrl: AlertController) { }

  async showToast(mess: string, dur: number = 2000, pos: any, color: any ='danger') {
    let toast = await this.toastController.create({
      message: mess,
      duration: dur,
      position: pos,
      color: color
    });
    return toast.present();
  }

  async showAlert(header: string, subHeader: string, mess: string) {
    const alertBox = await this.alertCtrl.create({ 
      header: header,
      subHeader: subHeader,
      message: mess,
      buttons: ['OK']
    });
    return await alertBox.present();
  }
}
