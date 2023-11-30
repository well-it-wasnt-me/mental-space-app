import {Component, OnInit, ViewChild} from '@angular/core';
import axios from "axios";
import {environment} from "../../../environments/environment";
import {IonModal, LoadingController} from "@ionic/angular";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/toast.service";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comportamenti',
  templateUrl: './comportamenti.page.html',
  styleUrls: ['./comportamenti.page.scss'],
})
export class ComportamentiPage implements OnInit {
  language: any;
  @ViewChild(IonModal) modal: IonModal;
  autolesivi_intenzione: any =  "0";
  autolesivi_azione: any = "false";
  suicidio_pensiero: any = "0";
  suicidio_azione: any = "false";
  alcol_intenzione: any =  "0";
  alcol_uso: any =  "false";
  droghe_intenzione: any =  "0";
  droghe_uso: any =  "false";
  assunzione_farmaci: any;
  abbuffate_intenzione: any =  "0";
  abbuffate_azione: any =  "false";
  vomito_intenzione: any =  "0";
  vomito_azione: any =  "false";
  elenco_tests: any = [];

  constructor(private loadingCtrl: LoadingController, private storageService: StorageService, private toastCrl: ToastService, private translateConfigService: TranslateConfigService, private translate: TranslateService ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async ngOnInit() {
    this.loadStorico();
  }

  async loadStorico(){
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

    axios.get(environment.apiURL + 'mobile/api/patient/test/comportamento', config).then((response) => {
      this.elenco_tests = response.data;
      loader.dismiss();
    })
      .catch((error) => {
        this.toastCrl.presentToast(error);
        console.log('axios error', error);
        loader.dismiss();
      });

    loader.dismiss();
  }


  chiudiModal() {
    this.modal.dismiss();
  }

  async salvaScheda() {
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

    let fd = new FormData();
    fd.append('gesti_autolesivi', '{"intenzione":"'+this.autolesivi_intenzione+'","azione":"'+this.autolesivi_azione+'"}');
    fd.append('tentativi_suicidio', '{"pensiero":"'+this.suicidio_pensiero+'","azione":"'+this.suicidio_azione+'"}');
    fd.append('assunzione_alcol', '{"intenzione":"'+this.alcol_intenzione+'","uso":"'+this.alcol_uso+'"}');
    fd.append('assunzione_droghe', '{"intenzione":"'+this.droghe_intenzione+'","uso":"'+this.droghe_uso+'"}');
    fd.append('assunzione_farmaci', '{"assunzione":"'+this.assunzione_farmaci+'"}');
    fd.append('abbuffate', '{"intenzione":"'+this.abbuffate_intenzione+'","azione":"'+this.abbuffate_azione+'"}');
    fd.append('vomito', '{"intenzione":"'+this.vomito_intenzione+'","azione":"'+this.vomito_azione+'"}');

    axios.post(environment.apiURL + 'mobile/api/patient/test/comportamento', fd, config).then((response) => {
      this.toastCrl.presentToast(response.data.message);
      loader.dismiss();
    })
      .catch((error) => {
        this.toastCrl.presentToast(error);
        console.log('axios error', error);
        loader.dismiss();
      });

    loader.dismiss();
  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
