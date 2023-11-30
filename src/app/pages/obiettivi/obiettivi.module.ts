import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObiettiviPageRoutingModule } from './obiettivi-routing.module';

import { ObiettiviPage } from './obiettivi.page';
import {ComponentsModule} from "../../components/components.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ObiettiviPageRoutingModule,
        ComponentsModule,
        FontAwesomeModule,
        TranslateModule
    ],
  declarations: [ObiettiviPage]
})
export class ObiettiviPageModule {}
