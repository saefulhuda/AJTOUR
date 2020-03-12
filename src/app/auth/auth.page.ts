import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';

const TOKEN = environment.api_token
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
todo = {email:'', password:''};
  constructor(public req: HttpRequestService) { }

  ngOnInit() {
  }

  doLogin() {
    let param = JSON.stringify({email: this.todo.email, password: this.todo.password});
    let url:string = "auth/user_login?request="+param+"&api_key="+TOKEN;
    this.req.getRequest(url).subscribe(data => 
      console.log(data));
  }

}
