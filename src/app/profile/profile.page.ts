import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavParams } from '@ionic/angular';
import { AppServiceService } from '../app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any;
  profileName: string;
  session: any;
  cameraData: string;
  constructor(private req: HttpRequestService, private route: Router, private storage: Storage, private camera: Camera) {
    this.session = []; 
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
    this.profile = [];
    let param = JSON.stringify({id: this.session.id});
    this.req.getRequest('live/get_user_by_id?request='+param+'&api_key='+TOKEN).subscribe(data => {
      this.profile = data.result;
    });
  }

  doLogout(){
    let clearSession = this.storage.remove('session');
    if (clearSession) {
      this.route.navigate(['/auth']);
    }
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(result => {
      let base64Image = 'data:image/jpeg;base64,' + result;
    });
  }

  takeCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(result => {
      console.log('data:image/jpeg;base64,'+result);
    });
  }

  updateProfile() {
    this.route.navigate(['/live/profile/update']);
  }

}

@Component({
  templateUrl: './general-profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class generalProfile implements OnInit {
  profile = [];
  constructor(private req: HttpRequestService, private activedRoute: ActivatedRoute, private app: AppServiceService) {
  }

  ngOnInit() {
    console.log('Class profile OK');
    this.activedRoute.params.subscribe(param => {
      // console.log(param.id);
      this.req.getRequest('live/get_user_by_id?request='+JSON.stringify({id:param.id})).subscribe(data => {
        if (data.status == 1) {
          this.profile = data.result;
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    })
  }
}
