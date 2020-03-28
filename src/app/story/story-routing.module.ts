import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoryPage, ModalComment } from './story.page';

const routes: Routes = [
  {
    path: '',
    component: StoryPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'comment',
    loadChildren: () => import('./comment/comment.module').then( m => m.CommentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoryPageRoutingModule {}
