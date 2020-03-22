import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, latLng, tileLayer, Layer, marker, Draggable} from 'leaflet';
import { NavController } from '@ionic/angular';
// import {
//   GoogleMaps,
//   GoogleMap,
//   GoogleMapsEvent,
//   GoogleMapOptions,
//   CameraPosition,
//   MarkerOptions,
//   Marker
// } from '@ionic-native/google-maps/ngx';

// declare var google;
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
  // map: GoogleMap;

  @ViewChild('mapId', {static: false}) mapElement: ElementRef;

  constructor(private navCtrl: NavController, private activatedRoute: ActivatedRoute, public req: HttpRequestService, private storage: Storage, private geolocation: Geolocation, private geocoder: NativeGeocoder) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      this.storage.get('session').then(data => {
        this.userId = data.id;
        this.ionViewDidEnter();
      })
    });
   }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = new Map('mapId').setView([-6.1821531,106.6520064], 18);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 20
    }).addTo(this.map);
    this.generateMemberPosition();
    // let mapOptions: GoogleMapOptions = {
    //   camera: {
    //     target: {
    //       lat: -6.894690,
    //       lng: 110.638618
    //     },
    //     zoom: 18,
    //     tilt: 30
    //   }
    // }
    
    // let coord = GoogleMaps.create('map', mapOptions);
    // this.map = GoogleMaps.create('map_canvas', mapOptions);

    // let marker: Marker = this.map.addMarkerSync({
    //   title: 'Ionic',
    //   icon: 'blue',
    //   animation: 'DROP',
    //   position: {
    //     lat: 43.0741904,
    //     lng: -89.3809802
    //   }
    // });
    // marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    //   alert('clicked');
    // });
    //  this.geolocation.getCurrentPosition().then((data) => {
    //    console.log(data.coords.latitude);
    //    console.log(data.coords.longitude);
    //   //  let Latlong = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
    //   //  let mapOptions = {
    //   //    center: Latlong,
    //   //    zoom: 15,
    //   //    mapTypeId: google.maps.MapTypeId.ROADMAP
    //   //  }
    //   // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //  });
   }

   generateMemberPosition() {
     this.cordinateList = [];
     let param = JSON.stringify({group_id: this.id});
     this.req.getRequest('live/read_member_in_group?request='+param+'&api_key='+TOKEN).subscribe((data) => {
       for(let list of data.result) {
        //  this.lat = list.cordinate.split(',')[0];
        //  this.long = list.cordinate.split(',')[1];
        //  let popUp = '<img src="' + list.path_image + '"><hr><p>' + list.name + '</p><br><p>' + list.phone + '</p>';
        //  marker([this.lat, this.long]).addTo(this.map)
        //    .bindPopup(popUp)
        //    .openPopup();
        // console.log(list.cordinate);
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
    let popUp = '<img src="' + image + '"><hr><p>' + name + '</p>';
    marker([lat, long]).addTo(this.map)
      .bindPopup(popUp)
      .openPopup();
  }

  submitCreateTour() {
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ionViewDidEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
