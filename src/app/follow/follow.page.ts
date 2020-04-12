import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.page.html',
  styleUrls: ['./follow.page.scss'],
})
export class FollowPage {
  
  userId: any;
  follower: any;
  following: any;
  constructor(public req: HttpRequestService, public app: AppServiceService, public storage: Storage, public route: Router) {
    this.storage.get('session').then(data => {
      this.userId = data.id;
      this.ngOnInit();
    });
   }

  ngOnInit() {
    console.log('show follower');
    this.req.getRequest('apptour/get_follower?request='+JSON.stringify({user_id:this.userId})).subscribe(data => {
      if (data.status == 1) {
        this.follower = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });
  }

  toProfile(id) {
    this.route.navigate(['live/profile/general/'+id]);
  }

}
