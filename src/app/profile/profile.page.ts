import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
profile: any;
profileName: string;
  constructor(public req: HttpRequestService, private route: Router) { }

  ngOnInit() {
    this.profile = [];
    let param = JSON.stringify({id:'12'});
    this.req.getRequest("live/get_user_by_id?request="+param+"&api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        console.log(data.result.image);
        this.profile = data.result;
        this.profileName = data.result.name.toUpperCase();
      } else {
        console.log(data.message);
      }
    });
  }

  doLogout() {
    this.route.navigate(['auth']);
  }

}
