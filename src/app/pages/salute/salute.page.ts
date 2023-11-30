import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {LoadingController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {Health} from "@awesome-cordova-plugins/health";
import {Router} from "@angular/router";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {TranslateConfigService} from "../../services/translate-config.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-salute',
  templateUrl: './salute.page.html',
  styleUrls: ['./salute.page.scss'],
})
export class SalutePage implements OnInit {
  myInfo = {
    full_name:"",
    pic:"",
    email: ""
  };
  mySteps = {
    today: "0"
  };

  healthData = [];

  language: any;
  constructor(private translateConfigService: TranslateConfigService, private translate: TranslateService , private storageService: StorageService, private loadingCtrl: LoadingController, private router: Router) {
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

    loader.present();

    this.storageService.get('user_data').then(
      (value) => {
        this.myInfo.full_name = value.f_name + " " + value.l_name;
        this.myInfo.pic = value.pic;
        this.myInfo.email = value.email;
      }
    )

    await Health.isAvailable().then(
      (res) => {
        if (!res) {
          alert("Spiacente, ma per funzionare ho bisogno di Google fit o Health (iOS). Torno alla dashboard");
          this.router.navigate(['/dashboard']);
        }
      });

    await Health.isAuthorized(['calories', 'distance', 'nutrition', 'steps', 'height', 'weight']).then(
      async (res) => {
        if (!res) {
          await Health.requestAuthorization([
            'calories', 'distance', 'nutrition',
            {
              read: ['steps', 'height', 'weight']
            }
          ]).then((res) => console.log("requestAuthorization", res))
            .catch((err) => console.log("err", err));
        }
      }
    )


    Health.query({
      startDate: new Date(new Date().getTime() - 10*24*60*60*1000 ),
// ten days ago
      endDate: new Date(), // now
      dataType: 'steps',
      limit: 10
    }).then( async data => {
      // @ts-ignore
      this.healthData = data;
      this.mySteps.today = data[0].value;

      let token;
      await this.storageService.get('access_token').then(
        (value: any) => {
          token = value;
        }
      )
      const config = {
        headers: {Authorization: `Bearer ${token}`}
      };

      let fd = new FormData();
      fd.append('passi', data[0].value);

      axios.post(environment.apiURL + 'mobile/api/patient/health/passi', fd, config);
      loader.dismiss();
    }).catch(e => {
      loader.dismiss();
      alert("Errore: " + e);
    })



  }

  submitForm(form: NgForm) {

  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
