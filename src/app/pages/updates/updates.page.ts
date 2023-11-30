import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {SplashScreen} from "@capacitor/splash-screen";
import {Deploy} from "cordova-plugin-ionic";

@Component({
  selector: 'app-updates',
  templateUrl: './updates.page.html',
  styleUrls: ['./updates.page.scss'],
})
export class UpdatesPage implements OnInit {
  appVersion: any;
  statusText: string = "initing..";

  constructor(private storage: StorageService,public router: Router) {
  }

  ngOnInit() {
    this.performManualUpdate();
    this.appVersion = environment.appVersion;
  }

  async splash(){
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  async performManualUpdate() {
    this.statusText = "Controllando aggiornamenti...";
    const update = await Deploy.checkForUpdate()

    if (update.available){
      await Deploy.downloadUpdate((progress) => {
        this.statusText = "Download: " + progress + ' %';
      })
      await Deploy.extractUpdate((progress) => {
        this.statusText = "Installazione: " + progress + ' %';
      })

      this.statusText = "Riavvio app in corso...";
      await Deploy.reloadApp();

    } else {
      this.statusText = "Nessun Aggiornamento trovato"
    }
  }


  handleRefresh($event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.performManualUpdate();
      // @ts-ignore
      $event.target.complete();
    }, 2000);
  }
}

