import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AppServiceService } from 'src/app/app-service.service';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  session: any;
  image: any;
  title: any;
  content: any;
  constructor(private camera: Camera, private app: AppServiceService, private req: HttpRequestService, private storage: Storage, private route: Router) { }

  ngOnInit() {
    console.log('initial');
    this.storage.get('session').then(data => {
      this.session = data;
    });
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
    }];
    this.app.showActionSheet(buttons);
  }

  postStory() {
    console.log('post story');
    let param = [{api_key:TOKEN}, {request:JSON.stringify({user_id:this.session.id, title:this.title, content:this.content})}, {file:this.image}];
    this.req.postRequest('apptour/post_story', param).subscribe(data => {
      console.log(data);
      if (data.status == 1) {
        this.app.showToast('Posted', 2000, 'top', 'success');
        this.route.navigate(['/live/story']);
      } else {
       this.app.showAlert('','Sabar ya !!', 'Anda belum memasukan gambar story'); 
      }
    });
  }

}
