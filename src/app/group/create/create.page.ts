import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppServiceService } from 'src/app/app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
name: string;
desc: string;
session: any;
  constructor(private route: Router, private req: HttpRequestService, public navCtrl: NavController, private app: AppServiceService, private storage: Storage) {
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data.email;
        this.SubmitCreateGroup();
      }
    });
   }

  ngOnInit() {
    console.log('Create');
  }

  SubmitCreateGroup() {
    let param = JSON.stringify({group_name:this.name, group_desc:this.desc, group_own:this.session, group_logo:'http://api.ajcomm.id/resources/images/groups/thumb.png'});
    this.req.getRequest("live/create_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
      // console.log(data);
      if (data.status == 1) {
        this.navCtrl.navigateForward(['live']);
      } else {
        this.app.showToast(data.message, 2000, 'middle');
      }
    });
  }

  doTakePicture() {
    console.log('Take Logo');
  }

}
