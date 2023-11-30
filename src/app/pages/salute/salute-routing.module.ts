import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalutePage } from './salute.page';

const routes: Routes = [
  {
    path: '',
    component: SalutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalutePageRoutingModule {}
