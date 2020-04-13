import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AppServiceService } from '../app-service.service';
import { ModalController, NavParams } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { from } from 'rxjs';

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
  storyStatus: any;
  
  follower: any = [];
  following: any = [];
  groups: any = [];
  user: any;
  start: any;
  limit: any;
  stories: any = [];
  constructor(public browser: InAppBrowser, public call: CallNumber, public modalController: ModalController, public activedRoute: ActivatedRoute, public req: HttpRequestService, public route: Router, private storage: Storage, private camera: Camera, public app: AppServiceService) {
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
    this.limit = 6;
    this.start = 0;
    this.profile = [];
    this.quoteStatus = 1;
    this.storyStatus = 0;
    let param = JSON.stringify({id: this.session.id});
    this.req.getRequest('apptour/get_user_by_id?request='+param+'&api_key='+TOKEN).subscribe(data => {
      this.profile = data.result;
    });
    this.req.getRequest('apptour/get_user_by_id?request='+JSON.stringify({id:this.session.id})).subscribe(data => {
      if (data.status == 1) {
        this.profile = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });

    this.req.getRequest('apptour/get_follower?request='+JSON.stringify({user_id:this.session.id})).subscribe(data => {
      if (data.status == 1) {
        this.follower = data.result;
      } else {
        this.follower = [];
      }
    });

    this.req.getRequest('apptour/get_following?request='+JSON.stringify({user_id:this.session.id})).subscribe(data => {
      if (data.status == 1) {
        this.following = data.result;
      } else {
        this.following = [];
      }
    });

    this.req.getRequest('apptour/get_all_group_by_member?request='+JSON.stringify({user_id:this.session.id})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.groups = data.result;
      } else {
        this.groups = [];
      }
    });

    this.loadStory();
  }

  protected loadStory() {
    this.req.getRequest('apptour/get_all_story_by_user_id?request='+JSON.stringify({user_id:this.session.id, start: this.start, limit: this.limit})+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let list of data.result) {
          this.stories.push(list);
          this.user = list.user_detail;
        }
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });
  }

  public doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  public loadData(event) {
    this.start = this.start + 6;
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadStory();
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

  public doLike(id) {
    let param = JSON.stringify({user_id:this.session.id, story_id:id});
    this.req.getRequest('apptour/add_like?request='+param+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.app.showToast(data.message, 2000, 'top', 'success');
      } else {
        this.app.showToast(data.message, 2000, 'top');
      }
    });
  }

  showComment(id) {
    this.route.navigate(['live/story/comment/'+id]);
  }

  toStory(id) {
    console.log(id);
  }

  showFollower(id) {
    this.route.navigate(['live/follow/'+id]);
  }

  showFollowing(id) {
    this.route.navigate(['live/following/'+id]);
  }

  showGroups(id) {
    this.route.navigate(['live/group/list/'+id]);
  }

  showStory(ev: any) {
    this.storyStatus = ev.detail.value;
  }

}

@Component({
  selector: 'general-profile',
  templateUrl: './general-profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class generalProfile extends ProfilePage implements OnInit {
  profile: any = [];
  arrGroup: any = [];

  ngOnInit() {
    console.log('Class profile OK');
    this.storyStatus = 0;
    this.start = 0;
    this.limit = 9;
    this.activedRoute.params.subscribe(param => {
      console.log(param.id);
      this.req.getRequest('apptour/get_user_by_id?request='+JSON.stringify({id:param.id})).subscribe(data => {
        if (data.status == 1) {
          this.profile = data.result;
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });

      this.req.getRequest('apptour/get_follower?request='+JSON.stringify({user_id:param.id})).subscribe(data => {
        if (data.status == 1) {
          this.follower = data.result;
        } else {
          this.follower = [];
        }
      });

      this.req.getRequest('apptour/get_following?request='+JSON.stringify({user_id:param.id})).subscribe(data => {
        if (data.status == 1) {
          this.following = data.result;
        } else {
          this.following = [];
        }
      });

      this.req.getRequest('apptour/get_all_group_by_member?request='+JSON.stringify({user_id:param.id})+'&api_key='+TOKEN).subscribe(data => {
        if (data.status == 1) {
          this.groups = data.result;
        } else {
          this.groups = [];
        }
      });
      this.loadStory();
    });
  }

  protected loadStory() {
    this.activedRoute.params.subscribe(param => {
      this.req.getRequest('apptour/get_all_story_by_user_id?request='+JSON.stringify({user_id:param.id, start: this.start, limit: this.limit})+'&api_key='+TOKEN).subscribe(data => {
        if (data.status == 1) {
          for (let list of data.result) {
            this.stories.push(list);
            this.user = list.user_detail;
          }
        } else {
          this.app.showToast(data.message, 2000, 'top', 'danger');
        }
      });
    });
  }

  doContact() {
    this.activedRoute.params.subscribe(param => {
      this.req.getRequest('apptour/get_user_by_id?request=' + JSON.stringify({ id: param.id })).subscribe(data => {
        if (data.status == 1) {
          let buttons = [{
            text: 'Call',
            role: 'destructive',
            icon: 'call-outline',
            handler: () => {
              console.log('Call ' + data.result.phone);
              this.call.callNumber(data.result.phone, true);
            }
          }, {
            text: 'Chat',
            icon: 'mail-outline',
            handler: () => {
              console.log('Chat ' + data.result.phone);
              this.browser.create("https://api.whatsapp.com/send?phone=" + data.result.phone);
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
      });
    });
  }

  toStory(id) {
    console.log(id);
  }

  doFollow(id) {
    console.log('do follow '+id);
    let param = JSON.stringify({user_id:this.session.id,following_user_id:id});
    this.req.getRequest('apptour/follow?request='+param+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1 || data.status == 2) {
        this.app.showToast(data.message, 2000, 'top', 'success');
        this.doRefresh(event);
      }
    });
  }

  doInvite() {
    this.req.getRequest('apptour/read_all_group_by_owner?request='+JSON.stringify({user_id:this.session.id})).subscribe(data => {
      if (data.status == 1) {
      }
    });
  }

  showStory(ev: any) {
    this.storyStatus = ev.detail.value;
  }
}

@Component({
  templateUrl: './modal-invite.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ModalInvite {
 
   constructor(private navParams: NavParams) {
   }
}
