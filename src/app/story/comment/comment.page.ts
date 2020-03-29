import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from 'src/app/http-request.service';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';

const TOKEN = environment.api_token;
@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {
  
  commentId: any;
  allComment: any;
  constructor(private activatedRoute: ActivatedRoute, private req: HttpRequestService, private app: AppServiceService, private route: Router) { 
    this.activatedRoute.params.subscribe(param => {
      this.commentId = param.id;
    });
  }

  ngOnInit() {
    let param = JSON.stringify({story_id: this.commentId});
    this.req.getRequest('apptour/get_all_comment?request='+param+'&api_key='+TOKEN).subscribe(data => {
      if (data.status == 1) {
        this.allComment = data.result;
      } else {
        this.app.showToast(data.message, 2000, 'top', 'danger');
      }
    });
  }

  backToStory() {
    this.route.navigate(['live/story']);
  }

  toProfile(id) {
    this.route.navigate(['/live/profile/general/'+id]);
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
