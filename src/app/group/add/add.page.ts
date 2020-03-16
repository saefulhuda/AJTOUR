import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

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
  constructor(private activatedRoute: ActivatedRoute, public req: HttpRequestService, public toastController: ToastController) { 
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
      }
    });
  }

  addMember(email) {
    let param = JSON.stringify({friend_mail:email, group_id:this.groupId})
    this.req.getRequest("live/add_friend_to_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.showToast(email+' berhasi ditambahkan', 2000, 'top');
      } else {
        this.showToast(data.message, 2000, top);
      }
    });
  }

  async showToast(mess: string, dur: number = 2000, pos: any) {
    let toast = await this.toastController.create({
      message: mess,
      duration: dur,
      position: pos,
      color: 'danger'
    });
    return toast.present();
  }

}
