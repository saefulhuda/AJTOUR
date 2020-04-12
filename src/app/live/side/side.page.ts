import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side',
  templateUrl: './side.page.html',
  styleUrls: ['./side.page.scss'],
})
export class SidePage implements OnInit {
  session: any;

  constructor(private storage: Storage, private route: Router) {
    this.session = [];
    this.storage.get('session').then(data => {
      this.session = data;
    });
  }

  ngOnInit() {
  }

  doLogout(){
    let clearSession = this.storage.remove('session');
    if (clearSession) {
      this.route.navigate(['/auth']);
    }
  }

}
