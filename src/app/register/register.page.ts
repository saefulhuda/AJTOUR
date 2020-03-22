import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http-request.service';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: any;
  password: any;
  passconf: any;
  phone: any;
  constructor(public req: HttpRequestService, private route: Router, private app: AppServiceService) { }

  ngOnInit() {
  }

  doRegister() {
    if (this.email == null) {
      this.app.showToast('Silahkan isi alamat email', 2000, 'top');
    } else if (this.phone == null) {
      this.app.showToast('Silahkan isi nomor telpon', 2000, 'top');
    } else if (this.password == null) {
      this.app.showToast('Silahkan isi password', 2000, 'top')
    } else if (this.passconf != this.password) {
      this.app.showToast('Konfimasi password tidak sama', 2000, 'top');
    } else {
      let param = JSON.stringify({ email: this.email, phone: this.phone, password: this.password });
      let url: string = "auth/user_register?request=" + param + "&api_key=" + TOKEN;
      this.req.getRequest(url).subscribe(data => {
        if (data.status == 1) {
          this.route.navigate(['/auth']);
        } else {
          this.app.showToast(data.message, 2000, 'top');
        }
      }
      );
    }
  }

  doLogin() {
    this.route.navigate(['/auth']);
  }

}
