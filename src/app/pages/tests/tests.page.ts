import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal, LoadingController, ToastController} from "@ionic/angular";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/toast.service";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.page.html',
  styleUrls: ['./tests.page.scss'],
})
export class TestsPage implements OnInit {
  language: any;
  @ViewChild(IonModal) modal: IonModal;
  elenco_tests: any = [];
  interesse: any = 0;
  depresso: any = 0;
  difficolta_sonno: any = 0;
  stanco: any = 0;
  poca_fame: any = 0;
  sensi_di_colpa: any = 0;
  difficolta_concentrazione: any = 0;
  movimento: any = 0;
  meglio_morte: any = 0;
  difficolta_problemi: any = 0;

  constructor(private translateConfigService: TranslateConfigService, private translate: TranslateService, private storageService: StorageService, private loadingCtrl: LoadingController, private toastCrl: ToastService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async ngOnInit() {
    this.loadStorico();
  }

  handleRefresh(event: any) {
    this.ngOnInit().then(() => {
      event.target.complete();
    });
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
    fd.append('interesse', this.interesse);
    fd.append('depresso', this.depresso);
    fd.append('difficolta_sonno', this.difficolta_sonno);
    fd.append('stanco', this.stanco);
    fd.append('poca_fame', this.poca_fame);
    fd.append('sensi_di_colpa', this.sensi_di_colpa);
    fd.append('difficolta_concentrazione', this.difficolta_concentrazione);
    fd.append('movimento', this.movimento);
    fd.append('meglio_morte', this.meglio_morte);
    fd.append('difficolta_problemi', this.difficolta_problemi);

    axios.post(environment.apiURL + 'mobile/api/patient/test/phq', fd, config).then((response) => {
      this.toastCrl.presentToast(response.data.message);
      this.loadStorico();
      loader.dismiss();
    })
      .catch((error) => {
        this.toastCrl.presentToast(error);
        console.log('axios error', error);
        loader.dismiss();
      });
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

    axios.get(environment.apiURL + 'mobile/api/patient/test/phq', config).then((response) => {
      this.elenco_tests = response.data;
      loader.dismiss();
    })
      .catch((error) => {
        this.toastCrl.presentToast(error);
        console.log('axios error', error);
        loader.dismiss();
      });
  }

  convertResult(score: number) {
    if( score < 5 ){
      return 'Depressione non rilevata';
    } else if (score >= 5 && score <= 9 ){
      return 'Sintomi depressivi minimi / Depressione sottosoglia';
    } else if (score >= 10 && score <= 14){
      return 'Depressione minore / Depressione maggiore lieve';
    } else if (score >= 15 && score <= 19){
      return 'Depressione maggiore moderata'
    } else if (score >= 20) {
      return 'Depressione maggiore severa';
    } else {
      return 'Sconosciuto';
    }
  }
}
