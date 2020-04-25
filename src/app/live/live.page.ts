import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-live',
  templateUrl: './live.page.html',
  styleUrls: ['./live.page.scss'],
})
export class LivePage implements OnInit {
  header: string = 'AJCOMM TOUR';
  session: any;
  profile: any;
  constructor(public nav: NavController, private route: Router, private menu: MenuController, private storage: Storage) {
    this.session = [];
    this.storage.get('session').then(data => {
      this.session = data;
    });
   }

  ngOnInit() {
  }

  showProfile() {
    console.log('show profile');
    this.route.navigate(['/live/profile']);
  }

  showSideMenu() {
    let currentUri = this.route.url;
    if (currentUri != '/live/side')  {
      this.route.navigate(['live/side']);
      console.log('Nav side menu');
    } else {
      this.nav.back();
      console.log('Nav back')
    }
  }

  showSearch() {
    this.route.navigate(['live/search']);
  }

}
