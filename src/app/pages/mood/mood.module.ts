import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoodPageRoutingModule } from './mood-routing.module';

import { MoodPage } from './mood.page';
import {ComponentsModule} from "../../components/components.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoodPageRoutingModule,
    ComponentsModule,
    FontAwesomeModule,
    TranslateModule
  ],
  declarations: [MoodPage]
})
export class MoodPageModule {}
