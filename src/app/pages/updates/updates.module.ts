import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatesPageRoutingModule } from './updates-routing.module';

import { UpdatesPage } from './updates.page';
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UpdatesPageRoutingModule,
        ComponentsModule,
        TranslateModule
    ],
  declarations: [UpdatesPage]
})
export class UpdatesPageModule {}
