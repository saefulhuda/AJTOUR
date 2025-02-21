import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage, generalProfile, ModalInvite } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule)
  },
  {
    path: 'general/:id',
    component: generalProfile
  },
  {
    path: 'modal',
    component: ModalInvite
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
