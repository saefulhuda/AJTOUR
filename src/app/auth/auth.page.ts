import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AppServiceService } from '../app-service.service';

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
  constructor(public app: AppServiceService, public req: HttpRequestService, private route: Router, private storage: Storage, private geolocation: Geolocation) {

  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then(data => {
      this.lat = data.coords.latitude;
      this.long = data.coords.longitude;
      this.doLogin();
    });
  }

  doLogin() {
    if (this.email == null) {
      this.app.showToast('Silahkan masukan email anda', 2000, 'top');
    } else if (this.password == null) {
      this.app.showToast('Silahkan masukan password', 2000, 'top');
    } else if (this.lat == null || this.long == null) {
      this.app.showToast('Silahkan hidupkan GPS', 2000, 'top');
    } else {
      let param = JSON.stringify({ email: this.email, password: this.password, lat: this.lat, long: this.long });
      let url: string = "auth/user_login?request=" + param + "&api_key=" + TOKEN;
      this.req.getRequest(url).subscribe(data => {
        if (data.status == 1) {
          if (this.storage.set('session', data.result)) {
            console.log('Catat session dan login');
            this.route.navigate(['/live']);
            this.app.showToast('Selamat datang di aplikasi ajtour indonesia', 8000, 'middle', 'primary');
          };
        } else {
          this.app.showToast(data.message, 2000, 'top');
        }
      }
      );
    }
  }

  toRegister() {
    this.route.navigate(['/register']);
  }
}