import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  groups: any;
  ads: any;
  constructor(public req: HttpRequestService, public route: Router, public navCtrl: NavController) {
  }

  ngOnInit() {
    this.ads = [];
    this.req.getRequest("services/get_all_ads?api_key=" + TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let list in data.result) {
          this.ads = data.result;
        }
      } else {
        console.log(data.message);
      }
    });

    this.ads = [
      {
        'title': 'Ads 1',
        'image': 'https://i.pinimg.com/originals/3e/2a/f6/3e2af664e061013a3d05aa99fa20c1d4.jpg',
        'desc': 'Landscape HD wallpaper | 1920x1080 | #38728 Temukan pin ini dan lainnya di Food and drink oleh Frantz Bricourt. Tag Landscape Wallpapers      Hd Nature Wallpapers      Hd Wallpapers 1080p      Nature Landscape      1080p Wallpaper      Beach Landscape      Desktop Backgrounds Desktop Wallpapers      Mobile Wallpaper'
      },
      {
        'title': 'Ads 2',
        'image': 'https://wallpapercave.com/wp/jiJZXEJ.jpg',
        'desc': 'WallpaperCave is an online community of desktop wallpapers enthusiasts. Join now to share and explore tons of collections of awesome wallpapers.'
      }
    ];
    this.groups = [];
    let param = JSON.stringify({ user_id: '12' });
    this.req.getRequest("live/read_all_group_by_user_id?request=" + param + "&api_key=" + TOKEN).subscribe(data => {
      // console.log(data);
      if (data.status == 1) {
        for (let list in data.result) {
          this.groups = data.result;
        }
      }
    });
  }

  showDetail(id) {
    this.route.navigate(['live/group/' + id]);
  }

  createGroup() {
    this.navCtrl.navigateForward(['live/group/create/app']);
  }

}

