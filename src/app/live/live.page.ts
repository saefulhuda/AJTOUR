import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live',
  templateUrl: './live.page.html',
  styleUrls: ['./live.page.scss'],
})
export class LivePage implements OnInit {
  header: string = 'AJCOMM TOUR';
  constructor(public nav: NavController, private route: Router) {
   }

  ngOnInit() {
  }

  showProfile()
  {
    // console.log('show profile');
    this.route.navigate(['/live/profile']);
  }

}
