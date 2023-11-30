import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {LoadingController} from "@ionic/angular";
import {HttpService} from "../services/http.service";
import {ToastService} from "../services/toast.service";
import axios from "axios";
import {environment} from "../../environments/environment";
import {TranslateConfigService} from "../services/translate-config.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userInfo = {
    f_name: "",
    l_name: "",
    email: "",
    password: ""
  }
  language: any;
  constructor(private router: Router, private httpService: HttpService, private loadingCtrl: LoadingController, private toastCtrl: ToastService, private translateConfigService: TranslateConfigService,
              private translate: TranslateService) {
    this.language = this.translateConfigService.getCurrentLang();
  }
  loginPage()
  {
    this.router.navigate(['login'])
  }
  ngOnInit() {
  }

  async login(form: NgForm) {
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();

    if(
      form.value.f_name.length == 0 ||
      form.value.l_name.length == 0 ||
      form.value.email.length == 0 ||
      form.value.password.length == 0
    ){
      loader.dismiss();
      alert("Mancano dei campi");
      return;
    }
    axios.post(environment.apiURL + "register_paz", {
      f_name: form.value.f_name,
      l_name: form.value.l_name,
      email: form.value.email,
      password: form.value.password,
    })
      .then((response) => {
        this.toastCtrl.presentToast(response.data.message);
        loader.dismiss();
        this.router.navigate(['/login'])
      })
      .catch((error) => {
        this.toastCtrl.presentToast(error.message);
        loader.dismiss();
      });
    loader.dismiss();
  }
}
