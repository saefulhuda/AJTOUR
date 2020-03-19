import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

const TOKEN = environment.api_token
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
email: string;
password: string;
lat: any;
long: any;
  constructor(public req: HttpRequestService, private route: Router, public toastController: ToastController, private storage: Storage, private geolocation: Geolocation) { 

  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then(data => {
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
      this.doLogin();
    });
  }

  doLogin() {
    let param = JSON.stringify({email: this.email, password: this.password, lat: this.lat, long: this.long});
    let url:string = "auth/user_login?request="+param+"&api_key="+TOKEN;
    this.req.getRequest(url).subscribe(data => 
      {
        if(data.status == 1) {
          if (this.storage.set('session', data.result)) {
          console.log('Catat session dan login');
          this.route.navigate(['/live']);
          };
        } else {
          this.showToast(data.message, 2000, 'top');
        }
      }
      );
  }

  toRegister() {
    this.route.navigate(['/register']);
  }

  async showToast(mess: string, dur: number = 2000, pos: any) {
    let toast = await this.toastController.create({
      message: mess,
      duration: dur,
      position: pos,
      color: 'danger'
    });
    return toast.present();
  }
}