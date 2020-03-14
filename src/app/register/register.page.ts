import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http-request.service';
import { Router } from '@angular/router';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string;
  password: any;
  phone: number;
  constructor(public req: HttpRequestService, private route: Router) { }

  ngOnInit() {
  }

  doRegister() {
    let param = JSON.stringify({phone:this.phone,email: this.email, password: this.password});
    let url:string = "auth/user_register?request="+param+"&api_key="+TOKEN;
    this.req.getRequest(url).subscribe(data => 
      {
        if(data.status == 1) {
          this.route.navigate(['/auth']);
        } else {
          console.log(data.message);
        }
      }
      );
  }

  doLogin() {
    this.route.navigate(['/auth']);
  }
}
