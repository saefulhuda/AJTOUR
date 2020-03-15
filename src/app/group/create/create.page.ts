import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { NavController, ToastController } from '@ionic/angular';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
name: string;
desc: string;
  constructor(private req: HttpRequestService, public navCtrl: NavController, private toastController: ToastController) { }

  ngOnInit() {
    console.log('Create');
  }

  SubmitCreateGroup() {
    let param = JSON.stringify({group_name:this.name, group_desc:this.desc, group_own:'saefulhuda@email.co.id', group_logo:'http://localhost/api.ajcomm.id/resources/images/users/thumb.png'});
    this.req.getRequest("live/create_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
      // console.log(data);
      if (data.status == 1) {
        this.navCtrl.navigateForward(['live']);
      } else {
        this.showToast(data.message, 2000, 'middle');
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
