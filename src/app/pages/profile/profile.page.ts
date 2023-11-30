import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/toast.service";
import axios from "axios";
import {Dialog} from "@capacitor/dialog";
import {environment} from "../../../environments/environment";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  language:any;
  myInfo = {
    full_name:"",
    pic:"",
    email: "",
    uid: 0,
    f_name:"",
    l_name:"",
    locale: "",
    reg_date: "",
    account_status: "",
    cf: "",
    dob: "",
    height: "",
    weight: "",
    telefono: "",
    em_nome: "",
    em_telefono: "",
    indirizzo: ""

  };
  profileForm: FormGroup;
  defaultDate: any;
  profile: {
    title:"",
    description: ""
  };
  constructor(private translateConfigService: TranslateConfigService, private translate: TranslateService, private loadingCtrl: LoadingController, private storageService: StorageService,public toastCtrl: ToastService, private router: Router) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async ngOnInit() {
    this.retrieveInfo();
  }

  async retrieveInfo() {

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    //loader.present();
    this.storageService.get('user_data').then(
      (value) => {
        this.myInfo.full_name = value.f_name + " " + value.l_name;
        this.myInfo.pic = value.pic;
        this.myInfo.email = value.email;
        this.myInfo.uid = value.uid;
        this.myInfo.f_name = value.f_name;
        this.myInfo.l_name = value.l_name;
        this.myInfo.locale = value.locale;
        this.myInfo.reg_date = value.reg_date;
        this.myInfo.account_status = value.account_status;
        this.myInfo.cf = value.cf;
        this.myInfo.dob = value.dob;
        this.myInfo.height = value.height;
        this.myInfo.weight = value.weight;
        this.myInfo.em_nome = value.em_nome;
        this.myInfo.em_telefono = value.em_telefono;
        this.myInfo.indirizzo = value.address || value.indirizzo;
        this.myInfo.telefono = value.telefono;
      }
    )
  }

  async submitForm(form: { value: any; }) {
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

    const params = {
      f_name: form.value.f_name,
      l_name: form.value.l_name,
      dob: form.value.dob,
      em_nome: form.value.em_nome,
      em_telefono: form.value.em_telefono,
      height: form.value.height,
      weight: form.value.weight,
      telefono: form.value.telefono,
      cf: form.value.cf,
      indirizzo: form.value.indirizzo
    };


    axios.post(environment.apiURL + "mobile/api/patient/update", JSON.stringify(params), config)
      .then((response) => {
        console.log(response);
        this.toastCtrl.presentToast(response.data.message);

        this.myInfo.full_name = form.value.f_name + " " + form.value.l_name;
        this.myInfo.f_name = form.value.f_name;
        this.myInfo.l_name = form.value.l_name;
        this.myInfo.cf = form.value.cf;
        this.myInfo.dob = form.value.dob;
        this.myInfo.height = form.value.height;
        this.myInfo.weight = form.value.weight;
        this.myInfo.em_nome = form.value.em_nome;
        this.myInfo.em_telefono = form.value.em_telefono;
        this.myInfo.indirizzo = form.value.indirizzo;
        this.myInfo.telefono = form.value.telefono;
        console.log(this.myInfo.telefono, form.value.telefono);
        this.storageService.store('user_data', this.myInfo);
        loader.dismiss();
      })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
  }

  getDate(e: any) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    // @ts-ignore
    this.profileForm.get('dob').setValue(date, {
      onlyself: true
    })
  }

  async do_logout() {
    const value = await Dialog.confirm({
      title: 'Attenzione',
      message: `Sicuro di voler effettuare il logout ?`,
    });

    if(value.value === true){
      this.storageService.clear();
      this.router.navigate(['home']);
    }
  }

  async eliminaAccount() {
    const value = await Dialog.confirm({
      title: 'Attenzione',
      message: `Questa azione è irreversibile, perderai tutti i tuoi dati e progressi. Sei sicuro ?`,
    });

    if(value.value === true){
      this.storageService.clear();
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

      axios.get(environment.apiURL + "mobile/api/patient/delete_account", config)
        .then((response) => {
          console.log(response);
          this.toastCtrl.presentToast(response.data.message);
          loader.dismiss();
          this.router.navigate(['home']);
        })
        .catch((error) => {
          console.log('axios error', error);
          this.toastCtrl.presentToast(error.message);
          loader.dismiss();
        });
    }
  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
