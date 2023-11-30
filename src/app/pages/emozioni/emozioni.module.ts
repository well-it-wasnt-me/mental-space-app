import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmozioniPageRoutingModule } from './emozioni-routing.module';

import { EmozioniPage } from './emozioni.page';
import {ComponentsModule} from "../../components/components.module";
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EmozioniPageRoutingModule,
        ComponentsModule,
        TranslateModule
    ],
  declarations: [EmozioniPage]
})
export class EmozioniPageModule {}
