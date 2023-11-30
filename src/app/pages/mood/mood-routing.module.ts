import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoodPage } from './mood.page';

const routes: Routes = [
  {
    path: '',
    component: MoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoodPageRoutingModule {}
