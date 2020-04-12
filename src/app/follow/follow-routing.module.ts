import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollowPage } from './follow.page';

const routes: Routes = [
  {
    path: '',
    component: FollowPage
  },
  {
    path: 'following',
    loadChildren: () => import('./following/following.module').then( m => m.FollowingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowPageRoutingModule {}
