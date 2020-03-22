import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  doUpdate() {

  }

  back() {
    this.route.navigate(['/live/profile']);
  }

}
