import { Component, OnInit } from '@angular/core';
import {LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {ToastService} from "../../services/toast.service";
import {StorageService} from "../../services/storage.service";
import {NgForm} from "@angular/forms";
import axios from "axios";
import {Md5} from "ts-md5";
import {Dialog} from "@capacitor/dialog";
import {environment} from "../../../environments/environment";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import * as mime from 'mime';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.page.html',
  styleUrls: ['./medico.page.scss'],
})
export class MedicoPage implements OnInit {
  language: any;
  public file: File;
  public totalSent: number = 0;
  public totalToSend: number = 0;


  myDoc = {
    pic: "",
    full_name: "",
    email: "",
    doc_id: undefined,
    paypal: undefined,
    photo: undefined,
    piva: undefined,
    rag_soc: undefined,
    tel: undefined,
    address: undefined,
    hr: undefined
  };
  public segment: string = 'doc_profile';
  api: any;

  fileLists: any;
  constructor(private storageService: StorageService,
              private toastCtrl: ToastService,
              private loadingCtrl: LoadingController,
              private router: Router,
              private fileOpener: FileOpener,
              private translateConfigService: TranslateConfigService,
              private translate: TranslateService
              ) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();

  }

  ngOnInit() {
    this.api = environment.apiURL;
    this.getMyDoctor();
    this.listMyFiles();
  }

  async downloadFile(_fileName: unknown){
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento file in corso...',
      spinner: 'circles',
    });
    loader.present();
    let token;
    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    let formData = new FormData();
    formData.append("file_name", <string>_fileName);
    axios({
      method: "post",
      url: environment.apiURL + 'mobile/api/patient/file/download',
      data: formData,
      responseType: "stream",
      headers: {Authorization: `Bearer ${token}`, "Content-Type":"application/octet-stream"}
    }).then(async (response) => {
      let content;
      content = response.data;
      await Filesystem.writeFile({
        data: content,
        path: <string>_fileName,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
        recursive: true
      }).then(async (res) => {
        loader.dismiss();
        if (typeof _fileName === "string") {
          this.fileOpener.showOpenWithDialog(_fileName, <string>mime.getType(<string>this.getExt(_fileName)))
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
          loader.dismiss();
        } else {
          alert("Not a string...something wrong");
          loader.dismiss();
        }
      });
      loader.dismiss();
  })
  }

  getExt(string: string | any[]){
    return string.slice(-3);
  }
  onFileChange(fileChangeEvent: Event){
    // @ts-ignore
    this.file = fileChangeEvent.target.files[0];
  }

  async uploadFile(){

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento file in corso...',
      spinner: 'circles',
    });
    loader.present();

    var formData: any = new FormData();

    formData.append('file', this.file, this.file.name);


    let token;
    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": 'multipart/form-data'
      },
      //@ts-ignore
      onUploadProgress: progressEvent => {
        this.totalSent = progressEvent.loaded;
        this.totalToSend = progressEvent.total
      }
    }

    axios.post(environment.apiURL + 'mobile/api/patient/file/upload', formData, config).then((response) => {
      console.log(response);
      this.toastCtrl.presentToast("Invito Inviato con Successo");
      this.listMyFiles();
      loader.dismiss();
    })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });

    loader.dismiss();
  };

  async listMyFiles(){
    let token;
    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios.get(environment.apiURL + 'mobile/api/patient/file/list', config).then((response) => {
      this.fileLists = response.data.files;
    })
      .catch((error) => {
        console.log('axios error', error);
      });
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getMyDoctor();
      this.listMyFiles();
      event.target.complete();
    }, 2000);
  }

  async submitInvitation(form: NgForm) {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();

    const params = {doc_email: form.value.doc_email};
    let token;
    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-wwww-form-urlencoded' }
    };

    axios.post(environment.apiURL + 'mobile/api/invite/doctor', JSON.stringify(params), config).then((response) => {
      this.toastCtrl.presentToast("Invito Inviato con Successo");
      loader.dismiss();
    })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });

    loader.dismiss();
  }

  async getMyDoctor(){
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

    axios.get(environment.apiURL + 'mobile/api/patient/my_doctor', config).then((response) => {
      this.myDoc.full_name = response.data[0].doc_name + " " + response.data[0].doc_surname;
      this.myDoc.doc_id = response.data[0].doc_id;
      this.myDoc.paypal = response.data[0].doc_paypal;
      this.myDoc.photo = response.data[0].doc_photo || "https://www.gravatar.com/avatar/" + Md5.hashStr(this.myDoc.email);
      this.myDoc.piva = response.data[0].doc_piva;
      this.myDoc.rag_soc = response.data[0].doc_rag_soc;
      this.myDoc.tel = response.data[0].doc_tel;
      this.myDoc.email = response.data[0].email;
      this.myDoc.address = response.data[0].doc_address;
      this.myDoc.hr = response.data[0].doc_hourlyrate;

      loader.dismiss();
    })
      .catch((error) => {
        console.log('axios error', error);
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });

    loader.dismiss();
  }

  async scollegaMedico() {
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

    const value = await Dialog.confirm({
      title: 'Attenzione',
      message: `Sicuro di voler scollegare il Tuo Medico ?`,
    });

    if(value.value){
      axios.get(environment.apiURL + 'mobile/api/patient/scollega_doc', config).then((response) => {
        this.myDoc = {
          pic: "",
          full_name: "",
          email: "",
          doc_id: undefined,
          paypal: undefined,
          photo: undefined,
          piva: undefined,
          rag_soc: undefined,
          tel: undefined,
          address: undefined,
          hr: undefined
        };
        loader.dismiss();
        window.location.reload();
      })
        .catch((error) => {
          console.log('axios error', error);
          this.toastCtrl.presentToast(error.message);
          loader.dismiss();
        });

      loader.dismiss();
    }

    loader.dismiss();
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }

  onSubmit() {

  }
}
