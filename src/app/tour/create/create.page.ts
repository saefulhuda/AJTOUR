import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, icon, Marker, polyline, latLng} from 'leaflet';
import { NavController, PopoverController } from '@ionic/angular';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  id;
  userId: any;
  map: Map;
  cordinateList: any;
  newMarker: any;

  @ViewChild('mapId', {static: false}) mapElement: ElementRef;

  constructor(private PopoverController: PopoverController, private navCtrl: NavController, private activatedRoute: ActivatedRoute, public req: HttpRequestService, private storage: Storage, private geolocation: Geolocation, private geocoder: NativeGeocoder, public route: Router) {
  // this.intervalLoad(); 
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
    let route = polyline([[ 46.78465227596462,-121.74141269177198 ],
      [ 46.80047278292477, -121.73470708541572 ],
      [ 46.815471360459924, -121.72521826811135 ],
      [ 46.8360239546746, -121.7323131300509 ],
      [ 46.844306448474526, -121.73327445052564 ],
      [ 46.84979408048093, -121.74325201660395 ],
      [ 46.853193528950214, -121.74823296256363 ],
      [ 46.85322881676257, -121.74843915738165 ],
      [ 46.85119913890958, -121.7519719619304 ],
      [ 46.85103829018772, -121.7542376741767 ],
      [ 46.85101557523012, -121.75431755371392 ],
      [ 46.85140013694763, -121.75727385096252 ],
      [ 46.8525277543813, -121.75995212048292 ],
      [ 46.85290292836726, -121.76049157977104 ],
      [ 46.8528160918504, -121.76042997278273 ]]);
      console.log(route);
    this.map = new Map('mapId').setView([latOwn, longOwn], 18);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 20
    }).addTo(this.map);
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

  // intervalLoad() {
  //   let timerId = setInterval(() => this.generateMemberPosition(), 10000);
  // }

  submitCreateTour() {
  }

  async showPopLocation(e) {
    const pop = await this.PopoverController.create({
      component: PopSelectLocation,
      event: e
    });
    pop.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}

@Component({
  templateUrl: 'pop-select-location.page.html',
})

export class PopSelectLocation extends CreatePage implements OnInit {

  ngOnInit() {
    
  }

  toLiveTour(id) {
    this.route.navigate(['tour/live/'+id]);
  }
}