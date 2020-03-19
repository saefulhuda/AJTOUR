import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
id;
  constructor(private activatedRoute: ActivatedRoute, public req: HttpRequestService) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
    });
   }

  ngOnInit() {
    console.log(this.id);
  }

  submitCreateTour() {
  }

}
