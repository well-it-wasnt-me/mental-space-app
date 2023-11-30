import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterbtnComponent } from './footerbtn/footerbtn.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [FooterbtnComponent, SidebarComponent],
   exports: [ FooterbtnComponent, SidebarComponent
  ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterLink,
        TranslateModule
    ]

})
export class ComponentsModule { }
