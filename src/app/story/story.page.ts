import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { Storage } from '@ionic/storage';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {
  stories: any;
  user: any;
  session: any = [];
  allComment: any;
  comment: any;
  constructor(public req: HttpRequestService, private route: Router, private app: AppServiceService, private storage: Storage) { 
    this.storage.get('session').then(data => {
      this.session = data;
    });
    this.allComment = 0;
  }

  ngOnInit() {
    console.log('initial');
    this.stories = [];
    this.user = [];
    this.req.getRequest("apptour/get_all_stories?api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
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

  doLike(id) {
    console.log('do like');
    let param = JSON.stringify({user_id: this.session.id, story_id: id});
    this.req.getRequest('apptour/add_like?request='+param+'&api_key='+TOKEN).subscribe(data => {
      console.log(data);
    });
    this.doRefresh(event);
  }

  doComment(id) {
    console.log('do comment');
    let param = JSON.stringify({user_id: this.session.id, story_id: id, comment: this.comment})
    this.req.getRequest('apptour/add_comment?request='+param+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.app.showToast('Komentar anda '+this.comment+' luar biasa!!', 2000, 'top', 'primary');
      } else {
        this.app.showToast(data.message, 2000, 'top', '');
      }
    });
    this.doRefresh(event);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  doPostStory() {
    this.route.navigate(['/live/story/add']);
  }

  showComment(id) {
    this.route.navigate(['live/story/comment/'+id]);
  }

  toProfile(id) {
    this.route.navigate(['live/profile/general/'+id]);
  }

}
