import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComportamentiPage } from './comportamenti.page';

const routes: Routes = [
  {
    path: '',
    component: ComportamentiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComportamentiPageRoutingModule {}
