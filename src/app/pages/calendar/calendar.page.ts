import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {Calendar} from "@awesome-cordova-plugins/calendar/ngx";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  appuntamenti: Array<any> = [];

  constructor(private storageService: StorageService, private Cal: Calendar, private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();

    let token;
    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios.get(environment.apiURL + 'mobile/api/patient/calendar', config).then((response) => {
      this.appuntamenti = response.data;
      loader.dismiss();
    })
      .catch((error) => {
        console.log('axios error', error);
        loader.dismiss();
      });

    loader.dismiss();
    await this.Cal.hasWritePermission().then((hasPerm) => {
      if (!hasPerm) {
        this.Cal.requestReadWritePermission();
      }
    })
  }

  async addToCalendar(appointment: any) {
    await this.Cal.createEvent(
      appointment.title,
      appointment.location,
      appointment.description,
      new Date(appointment.start),
      new Date(appointment.end)
    ).then((res) => {
      alert("Inserito con successo");
    })

  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
