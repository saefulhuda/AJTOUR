import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
member: any;
detail: any;
session: any;
sumMember: any;
  constructor(private route: Router, private activatedRoute: ActivatedRoute, public req: HttpRequestService, public navCtrl: NavController, private storage: Storage) {
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data.id;
        this.ngOnInit();
      }
    });
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.member = [] ;
      this.detail = [] ;
      // console.log("Params :", params.id);
      let param = JSON.stringify({group_id:params.id});
      this.req.getRequest("live/read_group_detail_by_id?request="+param+"&api_key="+TOKEN).subscribe(data => {
        // console.log(data);
        if (data.status == 1) {
          this.detail = data.result;
        }
      });
      this.req.getRequest("live/read_member_in_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
        if (data.status == 1) {
          this.member = data.result;
        }
        this.sumMember = data.result.length;
      });
    })
  }

  createTour(id) {
    this.navCtrl.navigateForward(['live/tour/create/'+id]);
  }

  toAddMember(id) {
    this.navCtrl.navigateForward(['live/group/add/'+id]);
    // console.log(id);
  }

}
