import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, marker, icon, Marker, polyline, latLng, popup} from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
})
export class TourPage {

  
  tileMap: any = [];
  id: any;
  userId: any;
  map: Map;
  cordinateList: any = [];
  newMarker: any;
  constructor(
    public activatedRoute: ActivatedRoute, 
    public storage: Storage, 
    public req: HttpRequestService, 
    public nav: NavController,
    public route: Router
    ) { 

  this.tileMap.street = tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 20
  });

  }

  ionViewDidEnter() {
    console.log('initial');
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      this.storage.get('session').then(data => {
        this.userId = data.id;

        this.req.getRequest('apptour/read_user_live_position?request=' + JSON.stringify({ user_id: this.userId })).subscribe(data => {
          if (data.status == 1) {
            this.loadMap(data.result.lat, data.result.long);
          }
        });
      })
    });
  }

  loadMap(latOwn:number, longOwn: number) {
    console.log('load map');
    this.map = new Map('mapId').setView([latOwn, longOwn], 18);
    this.tileMap.street.addTo(this.map);
    this.generateMemberPosition();
  }

   generateMemberPosition() {
    console.log('generate position');
     this.cordinateList = [];
     let param = JSON.stringify({group_id: this.id});
     this.req.getRequest('apptour/read_member_in_group?request='+param+'&api_key='+TOKEN).subscribe((data) => {
       for(let list of data.result) {
        this.cordinateList = data.result;
       }
       for(let cor of this.cordinateList) {
         let lat = cor.cordinate.split(',')[0];
         let long = cor.cordinate.split(',')[1];
         this.addMarker(lat, long, cor.path_image, cor.name);
       }
     });
  }

  removeMarker() {
    this.map.removeLayer(this.newMarker);
  }

  addMarker(lat: number, long: number, image: string, name: string) {
    console.log('add marker');
    const iconUrl = 'http://api.ajcomm.id/resources/images/maps/bike-marker.png';

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

  intervalLoad() {
    let timerId = setInterval(() => this.generateMemberPosition(), 10000);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.ionViewDidEnter();
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  backToGroup() {
    this.route.navigate(['live/group/'+this.id]);
  }

}
