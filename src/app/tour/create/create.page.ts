import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;
const TOKEN = environment.api_token;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  id;
  userId: any;
  lat: any;
  long: any;
  map: any;
  infoWindow: any;

  @ViewChild('map', {static: false}) mapElement: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, public req: HttpRequestService, private storage: Storage, private geolocation: Geolocation) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      this.storage.get('session').then(data => {
        this.userId = data.id;
        this.ngOnInit();
      })
    });
   }

   ngAfterViewInit() {
     this.loadMap();
   }

   loadMap() {
     this.geolocation.getCurrentPosition().then((data) => {
       console.log(data.coords.latitude);
       console.log(data.coords.longitude);
      //  let Latlong = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      //  let mapOptions = {
      //    center: Latlong,
      //    zoom: 15,
      //    mapTypeId: google.maps.MapTypeId.ROADMAP
      //  }
      // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
     });
   }

  ngOnInit() {
    this.loadMap();
    // this.map = new Map("map").setView([-6.22592,106.807296], 15);
    // this.map = new Map("map").fitWorld();
    // tileLayer(
    //   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // { 
    //   attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    // }).addTo(this.map);
  }

  submitCreateTour() {
  }

  position() {
  }

}
