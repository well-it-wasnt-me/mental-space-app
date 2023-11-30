import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {StorageService} from "../../services/storage.service";
import {environment} from "../../../environments/environment";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  language: any;
public url1: string = "";
public appVersion: string;
  constructor(private router: Router, private storageService: StorageService, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.appVersion = environment.appVersion;
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }
  loginPage()
  {
    this.router.navigate(['/login'])
  }

  ngOnInit() {
    this.url1 = this.router.url;
  }

}
