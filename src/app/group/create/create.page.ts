import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppServiceService } from 'src/app/app-service.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
name: string;
desc: string;
session: any;
image: any;
  constructor(private route: Router, private req: HttpRequestService, public navCtrl: NavController, private app: AppServiceService, private storage: Storage, private camera: Camera) {
    this.storage.get('session').then(data => {
      if (data==undefined) {
        this.route.navigate(['auth']);
      } else {
        this.session = data.email;
        this.SubmitCreateGroup();
      }
    });
   }

  ngOnInit() {
    console.log('initial');
  }

  SubmitCreateGroup() {
    console.log('create group');
    let param = [{request: JSON.stringify({group_name:this.name, group_desc:this.desc, group_own:this.session})}, {api_key: TOKEN}, {resources: this.image}];
    this.req.postRequest("apptour/create_group",param).subscribe(data => {
      // console.log(data);
      if (data.status == 1) {
        this.navCtrl.navigateForward(['live']);
      } else {
        this.app.showToast(data.message, 2000, 'middle');
      }
    });
  }

  doTakePicture() {
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

}
