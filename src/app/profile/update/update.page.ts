import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  session: any;
  profile = [];
  constructor(private route: Router, private req: HttpRequestService, private storage: Storage) {
    this.session = []; 
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data;
        this.ngOnInit();
      }
    });
   }

  ngOnInit() {
    // console.log(this.session);
    this.profile = this.session;
  }

  doUpdate() {

  }

  back() {
    this.route.navigate(['/live/profile']);
  }

}
