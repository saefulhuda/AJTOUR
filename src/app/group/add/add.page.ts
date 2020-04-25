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
members: any = [];
groupId: number;
  constructor(private activatedRoute: ActivatedRoute, public req: HttpRequestService, public app: AppServiceService, private route: Router) { 
    this.activatedRoute.params.subscribe((params) => {
      // console.log(params.id);
      this.groupId = params.id;
    });
  }

  ngOnInit() {
  }

  searchMember() {
    console.log('search member');
    let param = JSON.stringify({keyword:this.key});
    this.req.getRequest("data/search_users?request="+param+"&api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let t in data.result) {
          this.members = data.result;
        }
      } else if (data.status == 0 && data.error == 3) {
        this.app.showToast('Teman anda dengan email '+this.key+' tidak ditemukan', 4000, 'middle');
      }
    });
  }

  addMember(id) {
    console.log('add member');
    let param = JSON.stringify({friend_id:id, group_id:this.groupId})
    this.req.getRequest("apptour/add_friend_to_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.app.showToast(' berhasil ditambahkan', 4000, 'top', 'success');
        this.route.navigate(['live/group/',this.groupId]);
      } else {
        this.app.showToast(data.message, 2000, top);
      }
    });
  }

}
