import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {StorageService} from "../services/storage.service";
import {ToastService} from "../services/toast.service";
import {LoadingController} from "@ionic/angular";
import jwtDecode from "jwt-decode";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  language: any;
  constructor(private router: Router,
              private authService: AuthService,
              private storageService: StorageService,
              private toastService: ToastService,
              private loadingCtrl: LoadingController,
              private translateConfigService: TranslateConfigService,
              private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }



  postData = {
    username: '',
    password: '',
    role: 'patient'
  }

  validateInputs(){
    let username = this.postData.username.trim();
    let password = this.postData.password.trim();

    return(this.postData.username &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  async loginAction(){
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    if(this.validateInputs()){
      this.authService.login(this.postData).subscribe(
        (res:any) => {
          if (res.status == 'success') {
            this.storageService.store('access_token', res.access_token);
            this.storageService.store('expires_in', res.expires_in);
            this.storageService.store('token_type', res.token_type);

            this.storageService.store('user_data', jwtDecode(res.access_token));
            this.toastService.presentToast("Login effettuato con successo");
            this.router.navigate(['dashboard']);
            loader.dismiss();
          } else {
            this.toastService.presentToast('Errore Login')
            loader.dismiss();
          }
        },
        (error:any) => {
          this.toastService.presentToast("Errore: " + error.error.message);
          loader.dismiss();
        }
      );
    } else {
      await this.toastService.presentToast("Perfavore inserisci dati login");
      await loader.dismiss();
    }
  }
}
