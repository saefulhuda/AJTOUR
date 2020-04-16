import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  natures: any = [];
  foods: any = [];
  lodgings: any = [];
  news: any = [];
  details: any = [];
  constructor(public nav: NavController, public route: Router, public req: HttpRequestService, public app: AppServiceService, public activateRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log('initial');
    this.alterInit();
  }

  alterInit() {
    console.log('initial alternative');
    this.req.getRequest('services/get_reference/nature?request='+JSON.stringify({limit: 10})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.natures = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });

    this.req.getRequest('services/get_reference/food?request='+JSON.stringify({limit: 10})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.foods = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });

    this.req.getRequest('services/get_reference/lodging?request='+JSON.stringify({limit: 10})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.lodgings = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });

  }

  showDetail(id) {
    this.route.navigate(['live/discover/detail/'+id]);
  }

}

@Component({
  templateUrl: './discover-detail.page.html',
  styleUrls: ['./discover.page.scss'],
})

export class DiscoverDetail extends DiscoverPage {

  ngOnInit() {
    console.log('initial detail');
    this.activateRoute.params.subscribe(param => {
      this.req.getRequest('services/get_reference_detail?request='+JSON.stringify({id:param.id})+'&api_key='+TOKEN).subscribe(data => {
        if (data.status == 1) {
          this.details = data.result;
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    });
  }

  back() {
    this.nav.back();
  }
}
