import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {Calendar} from "@awesome-cordova-plugins/calendar/ngx";
import {EditorModule} from "@tinymce/tinymce-angular";
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

import { App } from '@capacitor/app';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import {LocalNotifications} from "@capacitor/local-notifications";
import { PushNotifications } from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [AppComponent],
  imports: [ TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  }), BrowserModule, EditorModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,AutocompleteLibModule],
  providers: [ FileOpener, Calendar, HttpClientModule,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    StatusBar.show();
  }
}

App.addListener('appStateChange', async ({ isActive }) => {

  if (isActive) {
    return;
  }
  // The app state has been changed to inactive.
  // Start the background task by calling `beforeExit`.
  const taskId = await BackgroundTask.beforeExit(async () => {
    await LocalNotifications.getPending();
    BackgroundTask.finish({ taskId });
  });

  setInterval(function(){

    console.log(taskId);
    console.log('fire!');
  }, 1800000);
});

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
