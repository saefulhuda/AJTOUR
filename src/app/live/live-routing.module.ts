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
        path: 'discover',
        children: [
          {
            path: '',
            loadChildren: () => 
            import('../discover/discover.module').then(m => m.DiscoverPageModule)
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
        path: 'follow/:id',
        loadChildren: () =>
        import('../follow/follow.module').then(m => m.FollowPageModule)
      },
      {
        path: 'following/:id',
        loadChildren: () =>
        import('../follow/following/following.module').then(m => m.FollowingPageModule)
      },
      {
        path: 'group/:id',
        loadChildren: () =>
        import('../group/group.module').then(m => m.GroupPageModule)
      },
      {
        path: 'group/list/:id',
        loadChildren: () =>
        import('../group/list/list.module').then(m => m.ListPageModule)
      },
      {
        path: 'tour/create/:id',
        loadChildren: () =>
        import('../tour/create/create.module').then(m => m.CreatePageModule)
      },
      {
        path: 'group/add/:id',
        loadChildren: () => 
        import('../group/add/add.module').then(m => m.AddPageModule)
      },
      {
        path: 'group/create/:any',
        loadChildren: () => 
        import('../group/create/create.module').then(m => m.CreatePageModule)
      },
      {
        path: 'side',
        loadChildren: () => import('./side/side.module').then( m => m.SidePageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
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
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivePageRoutingModule { }
