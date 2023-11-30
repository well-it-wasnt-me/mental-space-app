import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from "../../services/storage.service";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {IonModal, LoadingController} from "@ionic/angular";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  language:any;
  @ViewChild(IonModal) modal: IonModal;
  reports: any;
  public dateStart: string = "";
  public dateEnd: string = "";
  dates: any = { Start: "", End: ""};

  constructor(private translateConfigService: TranslateConfigService, private translate: TranslateService, private storageService: StorageService, private loadingCtrl: LoadingController) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {
    return;
  }

  async inviaReportFarmaci() {
    let token;

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });

    loader.present();

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    axios.get(environment.apiURL + "mobile/api/patient/report/pills", config)
      .then(async (response) => {
        loader.dismiss();
        alert(response.data.message);
      })
      .catch((error) => {
        alert("Qualcosa è andato storto. riprova più tardi altrimenti contattaci");
        console.log('axios error', error);
        loader.dismiss();
      });
  }

  async inviaReportUmore() {
    console.log(this.dates);
    if(this.dates.Start.length === 0){
      alert('Devi selezionare una data di inizio');
      return;
    }

    if(this.dates.End.length === 0){
      alert('Devi selezionare una data di fine');
      return;
    }

    let token;

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });

    loader.present();

    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    let fd = new FormData();
    fd.append('date_start', this.dates.Start);
    fd.append('date_end', this.dates.End);

    axios.post(environment.apiURL + "mobile/api/patient/report/mood", fd, config)
      .then(async (response) => {
        loader.dismiss();
        this.modal.dismiss();
        alert(response.data.message);
      })
      .catch((error) => {
        alert("Qualcosa è andato storto. riprova più tardi altrimenti contattaci");
        console.log('axios error', error);
        this.modal.dismiss();
        loader.dismiss();

      });
  }

  chiudiModal() {
    this.modal.dismiss();
  }

  onWillDismiss($event: any) {

  }
}
