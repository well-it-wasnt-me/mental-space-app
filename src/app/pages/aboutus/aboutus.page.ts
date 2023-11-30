import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment'
import {Share} from "@capacitor/share";
import {EmailComposer} from "capacitor-email-composer";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {
  language: any;
  user_data = {
    pic: ""
  };
  appVersion: any;

  constructor(private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.appVersion = environment.appVersion;
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {
  }

  share(){
    Share.share({
      title: 'Mental Space',
      text: 'Grazie per il passaparola ! Ne abbiamo bisogno',
      url: 'https://www.mentalspace.care/',
      dialogTitle: 'Condividi',
    });
  }

  sendMail(){

    let email = {
      to: 'info@mentalspace.care',
      subject: 'Feedback su APP',
      body: 'Scrivi qui tranquillamente quello che pensi',
      isHtml: true
    };

    // @ts-ignore
    EmailComposer.open(email);
  }

}
