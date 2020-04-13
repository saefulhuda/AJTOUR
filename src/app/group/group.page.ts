import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AppServiceService } from '../app-service.service';

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
profile: any;
image: any;
updateGroup: any;
  constructor(private app: AppServiceService, public camera: Camera, private route: Router, private activatedRoute: ActivatedRoute, public req: HttpRequestService, public navCtrl: NavController, private storage: Storage) {
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data;
        this.ngOnInit();
      }
    });
   }

  ngOnInit() {
    console.log('initial');
    this.updateGroup = 0;
    this.activatedRoute.params.subscribe((params) => {
      this.member = [] ;
      this.detail = [] ;
      // console.log("Params :", params.id);
      let param = JSON.stringify({group_id:params.id});
      this.req.getRequest("apptour/read_group_detail_by_id?request="+param+"&api_key="+TOKEN).subscribe(data => {
        // console.log(data);
        if (data.status == 1) {
          this.detail = data.result;
        }
      });
      this.req.getRequest("apptour/read_member_in_group?request="+param+"&api_key="+TOKEN).subscribe(data => {
        if (data.status == 1) {
          this.member = data.result;
        }
        this.sumMember = data.result.length;
      });
    })
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  createTour(id) {
    this.navCtrl.navigateForward(['live/tour/create/'+id]);
  }

  toAddMember(id) {
    this.navCtrl.navigateForward(['live/group/add/'+id]);
  }

  showProfile(id) {
    this.navCtrl.navigateForward(['/live/profile/general/'+id])
  }

  choiceFile(id) {
    let buttons = [{
      text: 'Camera',
      role: 'destructive',
      icon: 'camera',
      handler: () => {
        console.log('Camera clicked');
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }
        this.camera.getPicture(options).then((result) => {
          this.image = 'data:image/jpeg;base64,'+result;
          this.updateLogo(id);
        });
      }
    }, {
      text: 'File Gallery',
      icon: 'folder',
      handler: () => {
        console.log('File clicked');
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }
        this.camera.getPicture(options).then((result) => {
          this.image = 'data:image/jpeg;base64,'+result;
          this.updateLogo(id);
        });
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
    this.app.showActionSheet(buttons);
  }

  updateLogo(id) {
    console.log('update logo');
    let param = [{request: JSON.stringify({user_id: this.session.id, group_id: id})}, {api_key: TOKEN}, {file: this.image}];
    this.req.postRequest('apptour/update_logo_group', param).subscribe( data => {
      if (data.status == 1) {
        this.app.showToast('Update logo berhasil', 2000, 'top', 'success');
        this.doRefresh(event);
      } else {
        this.app.showToast(data.message, 2000, 'top');
      }
    });
  }

  updateDetail(id) {
    console.log('Update detail');
    let param = JSON.stringify({group_id: id, group_name: this.detail.group_name, group_desc: this.detail.group_desc, user_id: this.session.id});
    this.req.getRequest('apptour/update_group?request='+param+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.app.showToast('Group updated', 2000, 'top', 'success');
        this.doRefresh(event);
      } else {
        this.app.showToast(data.message, 2000, 'top');
      }
    });
  }

}
