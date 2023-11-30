import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PillsPageRoutingModule } from './pills-routing.module';

import { PillsPage } from './pills.page';
import {ComponentsModule} from "../../components/components.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PillsPageRoutingModule,
    ComponentsModule,
    FontAwesomeModule,
    AutocompleteLibModule,
    TranslateModule
  ],
  declarations: [PillsPage]
})
export class PillsPageModule {}
