import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-story',
  templateUrl: './story.page.html',
  styleUrls: ['./story.page.scss'],
})
export class StoryPage implements OnInit {
  stories: any;
  user: any;
  constructor(public req: HttpRequestService, private route: Router, private app: AppServiceService) { }

  ngOnInit() {
    this.stories = [];
    this.user = [];
    this.req.getRequest("live/get_all_stories?api_key="+TOKEN).subscribe(data => {
      if (data.status == 1) {
        for (let list of data.result) {
          this.stories = data.result;
          let param = JSON.stringify({id:list.user_id});
          this.req.getRequest("live/get_user_by_id?request="+param+"&api_key="+TOKEN).subscribe(data => {
            this.user = data.result;
          });
        }
      } else {
        console.log(data.result);
      }
    });
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

}
