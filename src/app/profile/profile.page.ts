import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AppServiceService } from '../app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  profile: any;
  profileName: string;
  session: any;
  cameraData: string;
  image: any;
  quote: any;
  quoteStatus: any;
  constructor(public activedRoute: ActivatedRoute, public req: HttpRequestService, public route: Router, private storage: Storage, private camera: Camera, public app: AppServiceService) {
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
    this.req.getRequest('apptour/get_user_by_id?request='+param+'&api_key='+TOKEN).subscribe(data => {
      this.profile = data.result;
    });
    this.quoteStatus = 1;
  }

  doLogout(){
    let clearSession = this.storage.remove('session');
    if (clearSession) {
      this.route.navigate(['/auth']);
    }
  }

  public doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  updateProfile() {
    this.route.navigate(['/live/profile/update']);
  }

  choiceFile() {
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
          this.profile.path_image = 'data:image/jpeg;base64,'+result;
          this.updatePhoto();
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
          this.profile.path_image = 'data:image/jpeg;base64,'+result;
          this.updatePhoto();
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

  updatePhoto() {
    let param = [{api_key: TOKEN},{file: this.profile.path_image}, {request:JSON.stringify({user_id:this.session.id})}];
    this.req.postRequest('auth/update_photo_profile', param).subscribe(data => {
      console.log(data);
      if (data.status == 1) {
        this.app.showToast('Berhasil diupdate', 2000, 'top', 'success');
      } else {
        this.app.showToast(data.message, 2000, 'top');
      }
    });
  }

  updateQuote() {
    console.log('Update quote');
    this.quoteStatus = 0;
  }

  doUpdateQuote(id) {
    console.log('update quote');
    console.log(this.quote);
    this.req.getRequest('auth/update_user_quote?request='+JSON.stringify({user_id:id, quote:this.quote})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.app.showToast('Success update quote', 2000, 'top');
        this.doRefresh(event);
      } else {
        this.app.showToast('Failed '+data.message, 2000, 'top');
      }
    });
    this.quoteStatus = 1;
  }

  toStory() {
    this.route.navigate(['/live/profile/story/'+this.session.id]);
  }

}

@Component({
  selector: 'general-profile',
  templateUrl: './general-profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class generalProfile extends ProfilePage implements OnInit {
  profile = [];
  // constructor(private req: HttpRequestService, private activedRoute: ActivatedRoute, private app: AppServiceService) {
  // }

  ngOnInit() {
    console.log('Class profile OK');
    this.activedRoute.params.subscribe(param => {
      // console.log(param.id);
      this.req.getRequest('apptour/get_user_by_id?request='+JSON.stringify({id:param.id})).subscribe(data => {
        if (data.status == 1) {
          this.profile = data.result;
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    })
  }

  doContact() {
    let buttons = [{
      text: 'Call',
      role: 'destructive',
      icon: 'call-outline',
      handler: () => {
        console.log('Call clicked');
      }
    }, {
      text: 'Chat',
      icon: 'mail-outline',
      handler: () => {
        console.log('File clicked');
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }];
    this.app.showActionSheet(buttons, 'Make contact');
  }

  toStory() {
    this.route.navigate(['/live/profile/story/'+this.session.id]);
  }
}

@Component({
  templateUrl: './story-profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class storyProfile extends ProfilePage implements OnInit {
  stories: any;
  user: any;
  session: any = [];
  allComment: any;
  comment: any;

  ngOnInit() {
    console.log('story by user');
    this.stories = [];
    this.user = [];
    this.req.getRequest("apptour/get_all_stories?api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        console.log(data);
        for (let list of data.result) {
          this.stories = data.result;
          let param = JSON.stringify({id:list.user_id});
          this.req.getRequest("apptour/get_user_by_id?request="+param+"&api_key="+TOKEN).subscribe(data => {
            this.user = data.result;
          });
        }
      } else {
        console.log(data.result);
      }
    });
  }
}
