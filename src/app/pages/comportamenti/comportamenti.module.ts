import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComportamentiPageRoutingModule } from './comportamenti-routing.module';

import { ComportamentiPage } from './comportamenti.page';
import {ComponentsModule} from "../../components/components.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComportamentiPageRoutingModule,
        ComponentsModule,
      TranslateModule
    ],
  declarations: [ComportamentiPage]
})
export class ComportamentiPageModule {}
