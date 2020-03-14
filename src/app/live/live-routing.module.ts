import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivePage } from './live.page';

const routes: Routes = [
  {
    path: 'live',
    component: LivePage,
    children: [
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chat/chat.module').then(m => m.ChatPageModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'story',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../story/story.module').then(m => m.StoryPageModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../about/about.module').then(m => m.AboutPageModule)
          }
        ]
      },
      {
        path: 'profile',
        loadChildren: () =>
        import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'group/:id',
        loadChildren: () =>
        import('../group/group.module').then(m => m.GroupPageModule)
      },
      {
        path: '',
        redirectTo: '/live/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/live/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivePageRoutingModule { }
