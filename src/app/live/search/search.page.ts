import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { AppServiceService } from 'src/app/app-service.service';
import { environment } from 'src/environments/environment';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  key: any;
  members: any = [];
  constructor(public route: Router, public req: HttpRequestService, public app: AppServiceService) { }

  ngOnInit() {
    console.log('inital');
  }

  searchMember() {
    this.req.getRequest('data/search_users?request='+JSON.stringify({keyword: this.key})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.members = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top');
      }
    });
  }

  showDetail(id) {
    this.route.navigate(['live/profile/general/'+id]);
  }

}
