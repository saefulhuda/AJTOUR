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
    this.start = 0;
    this.limit = 4;
  }

  ngOnInit() {
    console.log('initial');
    this.storage.get('session').then(data => {
      this.session = data;
      let param = JSON.stringify({ user_id: this.session.id, start: 0, limit: 4 });
      this.req.getRequest("apptour/get_all_story_by_following?request=" + param + "&api_key=" + TOKEN).subscribe(data => {
        if (data.status == 1) {
            this.stories = data.result;
            this.user = data.result.user_detail;
        } else {
          console.log(data.result);
        }
      });
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

  storyAction(id) {
    let buttons = [{
      text: 'Hapus',
      role: 'destructive',
      icon: 'trash-outline',
      handler: () => {
        console.log('Delete clicked');
        let param = JSON.stringify({user_id: this.session.id, story_id: id});
        this.req.getRequest('apptour/delete_story?request='+param+'&api_key='+TOKEN).subscribe(data => {
          if (data.status == 1) {
            this.app.showToast('Story berhasil dihapus', 2000, 'top', 'success');
            this.doRefresh(event);
          } else {
            this.app.showToast(data.message, 2000, 'top', 'danger');
          }
        });
      }
    }, {
      text: 'Update',
      icon: 'create-outline',
      handler: () => {
        console.log('Update clicked');
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }];
    this.app.showActionSheet(buttons, 'Actions');
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
