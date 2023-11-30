import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicoPageRoutingModule } from './medico-routing.module';

import { MedicoPage } from './medico.page';
import {ComponentsModule} from "../../components/components.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicoPageRoutingModule,
    ComponentsModule,
    FontAwesomeModule,
    TranslateModule
  ],
  declarations: [MedicoPage]
})
export class MedicoPageModule {}
