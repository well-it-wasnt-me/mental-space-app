import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiarioPageRoutingModule } from './diario-routing.module';

import { DiarioPage } from './diario.page';
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ComponentsModule} from "../../components/components.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DiarioPageRoutingModule,
        EditorComponent,
        FontAwesomeModule,
        ComponentsModule,
        TranslateModule
    ],
  declarations: [DiarioPage]
})
export class DiarioPageModule {}
