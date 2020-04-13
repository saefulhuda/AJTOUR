import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { AppServiceService } from 'src/app/app-service.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})
export class FollowingPage implements OnInit {

  following: any = [];
  constructor(public activatedRoute: ActivatedRoute, public req: HttpRequestService, public app: AppServiceService, public route: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      this.req.getRequest('apptour/get_following?request='+JSON.stringify({user_id: param.id})).subscribe(data => {
        if (data.status == 1) {
          this.following = data.result;
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    });
  }

  toProfile(id) {
    this.route.navigate(['live/profile/general/'+id]);
  }

}
