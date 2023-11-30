import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal, LoadingController} from "@ionic/angular";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/toast.service";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-emozioni',
  templateUrl: './emozioni.page.html',
  styleUrls: ['./emozioni.page.scss'],
})
export class EmozioniPage implements OnInit {
  language: any;
  @ViewChild(IonModal) modal: IonModal;
  rabbia: any = "0";
  paura: any = "0";
  gioia: any = "0";
  colpa: any = "0";
  tristezza: any = "0";
  sofferenza_fisica_emotiva: any = "0";
  abilita_messe_in_pratica: any = "0";
  intenzione_abbandono_terapia: any = "0";
  fiducia_cambiamento: any = "0";
  note: any = "";
  elenco_tests: any = [];
  vergogna: any = "0";

  constructor(private loadingCtrl: LoadingController, private storageService: StorageService, private toastCrl: ToastService,private translateConfigService: TranslateConfigService, private translate: TranslateService) {
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

    axios.get(environment.apiURL + 'mobile/api/patient/test/emozioni', config).then((response) => {
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
    fd.append('rabbia', this.rabbia);
    fd.append('paura', this.paura);
    fd.append('gioia', this.gioia);
    fd.append('colpa', this.colpa);
    fd.append('tristezza', this.tristezza);
    fd.append('vergogna', this.vergogna);
    fd.append('sofferenza_fisica_emotiva', this.sofferenza_fisica_emotiva);
    fd.append('abilita_messe_in_pratica', this.abilita_messe_in_pratica);
    fd.append('intenzione_abbandono_terapia', this.intenzione_abbandono_terapia);
    fd.append('fiducia_cambiamento', this.fiducia_cambiamento);
    fd.append('note', this.note);

    axios.post(environment.apiURL + 'mobile/api/patient/test/emozioni', fd, config).then((response) => {
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
