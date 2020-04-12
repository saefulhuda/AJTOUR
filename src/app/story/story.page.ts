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
  stories: any = [];
  user: any = [];
  session: any = [];
  allComment: any;
  allStories: any = [];
  comment: any;
  start: any;
  limit: any;
  constructor(public req: HttpRequestService, private route: Router, private app: AppServiceService, private storage: Storage) {
    this.allComment = 0;
  }

  ngOnInit() {
    console.log('initial');
    this.start = 0;
    this.limit = 4;
    this.storage.get('session').then(data => {
      this.session = data;
      this.loadStory();
    });
  }

  loadStory() {
    let param = JSON.stringify({user_id: this.session.id, start: this.start, limit: this.limit });
    this.req.getRequest("apptour/get_all_story_by_following?request=" + param + "&api_key=" + TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let list of data.result) {
          this.stories.push(list);
          this.user = list.user_detail;
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
      if (data.status == 1) {
        this.app.showToast(data.message, 2000, 'top', 'primary');
        this.doRefresh(event);
      } else {
        this.app.showToast(data.message, 2000, 'top', 'dark');
      }
    });
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

  loadData(event) {
    this.start = this.start + 4;
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadStory();
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
