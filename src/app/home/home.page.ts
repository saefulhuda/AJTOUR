import { Component } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
groups: any;
  constructor(public req: HttpRequestService, public route: Router) {}

  ngOnInit() {
    // console.log('home OK');
    this.groups = [];
    let param = JSON.stringify({user_id:'12'});
    this.req.getRequest("live/read_all_group_by_user_id?request="+param+"&api_key="+TOKEN).subscribe(data => {
      // console.log(data);
      if(data.status == 1) {
        for (let list in data.result) {
          this.groups = data.result;
        }
      }
    });
  }

  showDetail(id) {
    this.route.navigate(['live/group/'+id]);
  }

}
