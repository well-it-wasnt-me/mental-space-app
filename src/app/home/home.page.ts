import { Component, OnInit } from '@angular/core';
import {StorageService} from "../services/storage.service";
import {Router} from "@angular/router";
import {environment} from '../../environments/environment'
import {delay} from "rxjs";
import {SplashScreen} from "@capacitor/splash-screen";
import {Deploy} from "cordova-plugin-ionic";


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  appVersion: any;
  statusText: string = "initing..";

  constructor(private storage: StorageService,public router: Router) {
  }

  ngOnInit() {
    this.appVersion = environment.appVersion;
    this.redirect();
  }

  async performManualUpdate() {
    this.statusText = "Controllando aggiornamenti...";
    const update = await Deploy.checkForUpdate()
    console.log(update);
    if (update.available){
      await Deploy.downloadUpdate((progress) => {
        this.statusText = "Download: " + progress + " %";
        console.log(progress);
      })
      await Deploy.extractUpdate((progress) => {
        this.statusText = "Installazione: " + progress + " %";
      })

      Deploy.reloadApp();
    } else {
      console.log("No Update");
      this.statusText = "Nessun Aggiornamento trovato"
      this.redirect();
    }
  }

  redirect(){
    let tok;
    if( !this.storage.get('access_token')){
      this.router.navigate(['/login']);
    }
    this.storage.get('access_token').then(
      (value) => {
        tok  = value;
        if(tok.length > 0){
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  handleRefresh($event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.performManualUpdate();
      // @ts-ignore
      event.target.complete();
    }, 2000);
  }
}
