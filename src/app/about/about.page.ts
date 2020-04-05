import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
guids: any;
company: any;
  constructor(private route: Router, private req: HttpRequestService) {
  }

  ngOnInit() {
    console.log('initial');
    this.guids = [];
    this.company = [];
    this.req.getRequest("companies/get_guids?api_key=" + TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let t in data.result) {
          this.guids = data.result;
        }
    }
    });

    this.req.getRequest("companies/get_about_company?api_key=" + TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let t in data.result) {
          this.company = data.result;
        }
      }
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
