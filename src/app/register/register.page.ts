import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http-request.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
email: any;
password: any;
phone: any;
  constructor(public req: HttpRequestService, private route: Router, private toastController: ToastController) { }

  ngOnInit() {
  }

  doRegister() {
    let param = JSON.stringify({email: this.email, phone: this.phone, password: this.password});
    let url:string = "auth/user_register?request="+param+"&api_key="+TOKEN;
    this.req.getRequest(url).subscribe(data => 
      {
        if(data.status == 1) {
          this.route.navigate(['/auth']);
        } else {
          this.showToast(data.message, 2000, 'top');
        }
      }
      );
  }

  doLogin() {
    this.route.navigate(['/auth']);
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
