import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { stringify } from 'querystring';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  groups: any;
  ads: any;
  session: any;
  constructor(public req: HttpRequestService, public route: Router, public navCtrl: NavController, private storage: Storage) {
    this.storage.get('session').then(data => {
      if (data == undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data.id;
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.ads = [];
    this.req.getRequest("services/get_all_ads?api_key=" + TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let list in data.result) {
          this.ads = data.result;
        }
      } else {
        console.log(data.message);
      }
    });
    this.groups = [];
    let param = JSON.stringify({ user_id: this.session });
    this.req.getRequest("live/read_all_group_by_user_id?request=" + param + "&api_key=" + TOKEN).subscribe(data => {
      // console.log(data);
      if (data.status == 1) {
        for (let list in data.result) {
          this.groups = data.result;
        }
      }
    });
  }

  showDetail(id) {
    this.route.navigate(['live/group/' + id]);
  }

  createGroup() {
    this.navCtrl.navigateForward(['live/group/create/app']);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}

