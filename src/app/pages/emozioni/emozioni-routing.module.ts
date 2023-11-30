import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmozioniPage } from './emozioni.page';

const routes: Routes = [
  {
    path: '',
    component: EmozioniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmozioniPageRoutingModule {}
