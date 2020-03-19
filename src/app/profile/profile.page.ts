import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any;
  profileName: string;
  session: any;
  constructor(public req: HttpRequestService, private route: Router, private storage: Storage) { 
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data.id;
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.profile = [];
    let param = JSON.stringify({ id: this.session});
    this.req.getRequest("live/get_user_by_id?request=" + param + "&api_key=" + TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.profile = data.result;
        this.profileName = data.result.name.toUpperCase();
      }
    });
  }

  doLogout(){
    let clearSession = this.storage.remove('session');
    if (clearSession) {
      this.route.navigate(['/auth']);
    }
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
