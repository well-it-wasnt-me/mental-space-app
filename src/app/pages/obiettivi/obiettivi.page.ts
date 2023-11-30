import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {LoadingController, ToastController} from "@ionic/angular";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/toast.service";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-obiettivi',
  templateUrl: './obiettivi.page.html',
  styleUrls: ['./obiettivi.page.scss'],
})
export class ObiettiviPage implements OnInit {
  language: any;
  objectives: Array<any>;
  obiettivo: any;

  constructor(private loadingCtrl: LoadingController, private storageService: StorageService, private toastCtrl: ToastService, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async ngOnInit() {
    this.getObjectives();
  }

  async getObjectives() {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    let token;

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-wwww-form-urlencoded' }
    };

   await axios.get(environment.apiURL + "mobile/api/obiettivi/list", config)
      .then((response) => {
        this.objectives = response.data;
        loader.dismiss();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }
  async submitForm(form: NgForm) {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    let token;

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-wwww-form-urlencoded' }
    };
    let fd = new FormData();
    fd.append('obiettivo', this.obiettivo);

    axios.post(environment.apiURL + "mobile/api/obiettivi/add", fd, config)
      .then((response) => {
        this.getObjectives();
        this.toastCtrl.presentToast(response.data.status);
        loader.dismiss();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }

  async updateObiettivo(ob_id: number, ob_content: string) {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    let token;

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-wwww-form-urlencoded' }
    };
    let fd = new FormData();
    // @ts-ignore
    fd.append('ob_id', ob_id);
    fd.append('obiettivo', ob_content);

    axios.post(environment.apiURL + "mobile/api/obiettivi/update", fd, config)
      .then((response) => {
        this.getObjectives();
        console.log(response, ob_id, ob_content);
        this.toastCtrl.presentToast(response.data.status);
        loader.dismiss();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }

  async deleteObiettivo(ob_id: number) {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    let token;

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-wwww-form-urlencoded' }
    };
    let fd = new FormData();
    // @ts-ignore
    fd.append('ob_id', ob_id);

    axios.post(environment.apiURL + "mobile/api/obiettivi/delete", fd, config)
      .then((response) => {
        this.getObjectives();
        console.log(response);
        this.toastCtrl.presentToast(response.data.status);
        loader.dismiss();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
