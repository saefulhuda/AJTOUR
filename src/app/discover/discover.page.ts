import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Map, tileLayer, marker, icon, Marker, polyline, latLng} from 'leaflet';

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
  map: Map;
  newMarker: any;
  tileMap: any = [];
  constructor(public nav: NavController, public route: Router, public req: HttpRequestService, public app: AppServiceService, public activateRoute: ActivatedRoute) {
    this.tileMap.street = tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 20
    });
   }

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
          if (this.details.cordinate != '') {
            this.loadMap(this.details.lat, this.details.long, this.details.image, this.details.title);
          }
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    });
  }

  loadMap(lat: number, long: number, image: string, name: string) {
    this.map = new Map('mapId').setView([lat, long], 20);
    this.tileMap.street.addTo(this.map);
    this.addMarker(lat, long, image, name);
  }

  addMarker(lat: number, long: number, image: string, name: string) {
    console.log('add marker');
    const iconUrl = 'http://api.ajcomm.id/resources/images/maps/location-marker.png';

    const iconDefault = icon({
      iconUrl,
      iconSize: [100, 100],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;

    let popUp = '<img src="' + image + '"><hr><p>' + name + '</p>';
    this.newMarker = marker([lat, long], {draggable: 
      true}).addTo(this.map)
      .bindPopup(popUp);
      // .openPopup();
  }

  back() {
    this.nav.back();
  }

  flight() {
    console.log('do fligh');
  }

  ticketing() {
    console.log('do ticketing');
  }
}
