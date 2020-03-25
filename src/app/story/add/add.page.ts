import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AppServiceService } from 'src/app/app-service.service';
import { HttpRequestService } from 'src/app/http-request.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  session: any;
  image: any;
  title: any;
  description: any;
  constructor(private camera: Camera, private app: AppServiceService, private req: HttpRequestService, private storage: Storage) { }

  ngOnInit() {
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
    }]
    this.app.showActionSheet(buttons);
  }

  postStory() {
    let param = [{api_key:'414414'}, {request:JSON.stringify({user_id:this.session.id, title:this.title, description:this.description})}, {file:this.image}];
    this.req.postRequest('live/post_story', param).subscribe(data => {
      console.log(data);
    });
  }

}
