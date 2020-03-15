import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
key: any;
member: any;
  constructor(private activatedRoute: ActivatedRoute, public req: HttpRequestService) { 
    this.activatedRoute.params.subscribe((params) => {
      console.log(params.id);
      this.member = [];
    });
  }

  ngOnInit() {
  }

  searchMember() {
    let param = JSON.stringify({email:this.key});
    this.req.getRequest("live/get_user_by_email?request="+param+"&api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let t in data.result) {
          this.member = data.result;
        }
      }
    });
  }

  showMember(id) {
    console.log(id);
  }

}
