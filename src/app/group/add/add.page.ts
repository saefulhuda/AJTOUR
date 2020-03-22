import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
key: any;
member: any;
groupId: number;
  constructor(private activatedRoute: ActivatedRoute, public req: HttpRequestService, public app: AppServiceService, private route: Router) { 
    this.activatedRoute.params.subscribe((params) => {
      // console.log(params.id);
      this.groupId = params.id;
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
      } else if (data.status == 0 && data.error == 3) {
        this.app.showToast('Teman anda dengan email '+this.key+' tidak ditemukan', 4000, 'middle');
      }
    });
  }

  addMember(email) {
    let param = JSON.stringify({friend_mail:email, group_id:this.groupId})
    this.req.getRequest("live/add_friend_to_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.app.showToast(email+' berhasil ditambahkan', 4000, 'top', 'success');
        this.route.navigate(['live/group/',this.groupId]);
      } else {
        this.app.showToast(data.message, 2000, top);
      }
    });
  }

}
