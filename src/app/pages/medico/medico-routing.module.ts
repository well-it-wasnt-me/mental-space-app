import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicoPage } from './medico.page';

const routes: Routes = [
  {
    path: '',
    component: MedicoPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicoPageRoutingModule {}
