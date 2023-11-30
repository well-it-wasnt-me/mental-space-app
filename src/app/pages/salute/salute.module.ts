import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalutePageRoutingModule } from './salute-routing.module';

import { SalutePage } from './salute.page';
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SalutePageRoutingModule,
        ComponentsModule,
      TranslateModule
    ],
  declarations: [SalutePage]
})
export class SalutePageModule {}
