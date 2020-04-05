import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-side',
  templateUrl: './side.page.html',
  styleUrls: ['./side.page.scss'],
})
export class SidePage implements OnInit {
  session: any;

  constructor(private storage: Storage) {
    this.session = [];
    this.storage.get('session').then(data => {
      this.session = data;
    });
  }

  ngOnInit() {
  }

}
