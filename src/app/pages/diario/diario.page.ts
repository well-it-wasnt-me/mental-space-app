import { Component, OnInit, ViewChild } from '@angular/core';
import {IonModal, LoadingController} from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import axios from "axios";
import {environment} from "../../../environments/environment";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/toast.service";
import {Dialog} from "@capacitor/dialog";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.page.html',
  styleUrls: ['./diario.page.scss'],
})
export class DiarioPage implements OnInit {
  language: any;
  @ViewChild(IonModal) modal: IonModal;
  myDiary: any;
  myEntries:any;
  entrie = {creation_date: "", content: ""};

  constructor(private loadingCtrl: LoadingController, private storageService: StorageService,public toastCtrl: ToastService, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async ngOnInit() {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento in corso...',
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
      headers: { Authorization: `Bearer ${token}` }
    };

    axios.get(environment.apiURL + "mobile/api/patient/diary", config)
      .then((response) => {
        this.myEntries = response.data.entries;
        loader.dismiss();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }


  onWillDismiss($event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm' && this.myDiary) {
      this.myDiary = `${ev.detail.data}`;
      this.uploadDiario();
    }
  }

  cancelModal() {
    this.modal.dismiss(null, 'cancel');
  }

  confirmModal() {
    this.modal.dismiss(this.myDiary, 'confirm')
  }
  async uploadDiario(){
    const loader = await this.loadingCtrl.create({
      message: 'Salvataggio in corso...',
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

    const params = {
      diario: this.myDiary
    };

    axios.post(environment.apiURL + "mobile/api/patient/diary", JSON.stringify(params), config)
      .then((response) => {
        this.toastCtrl.presentToast(response.data.message);
        loader.dismiss();
        this.ngOnInit();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }
  isModalOpen = false;
  isModalEditOpen = false;
  myDiaryEdit: any;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  readEntry(creation_date: any, content: any) {
    // @ts-ignore
    this.entrie.creation_date = creation_date;
    // @ts-ignore
    this.entrie.content = content;
    this.setOpen(true);
  }

  async delEntry(id: number) {
    const value = await Dialog.confirm({
      title: 'Attenzione',
      message: `Sicuro di voler cancellare questo elemento ?`,
    });

    if(value.value === true){
      const loader = await this.loadingCtrl.create({
        message: 'Elimninazione in corso...',
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
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.get(environment.apiURL + "mobile/api/patient/diary/delete/" + id, config)
        .then((response) => {
          this.toastCtrl.presentToast(response.data.message);
          loader.dismiss();
          this.ngOnInit();
        })
        .catch((error) => {
          console.log('axios error', error);
          this.toastCtrl.presentToast(error.message);
          loader.dismiss();
        });
    }
  }

  updateEntry() {
    this.setOpenEdit(true);
    this.myDiaryEdit = this.entrie.content;
  }

  setOpenEdit(b: boolean) {
    this.isModalEditOpen = b;
  }

  handleRefresh(event:any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
