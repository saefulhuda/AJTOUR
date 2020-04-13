import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/http-request.service';
import { AppServiceService } from 'src/app/app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  groups: any = [];
  constructor(public req: HttpRequestService, public app: AppServiceService, public activateRoute: ActivatedRoute, public route: Router) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(param => {
      this.req.getRequest('apptour/get_all_group_by_member?request='+JSON.stringify({user_id:param.id})+'&api_key='+TOKEN).subscribe(data => {
        if (data.status == 1) {
          this.groups = data.result;
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    });
  }

  toGroupDetail(id) {
    this.route.navigate(['live/group/'+id]);
  }

}
