import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {
  CancelOptions, LocalNotificationPendingList,
  LocalNotificationRequest,
  LocalNotifications,
  ScheduleOptions
} from "@capacitor/local-notifications";
import {ActionSheetController} from "@ionic/angular";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {ToastService} from "../../services/toast.service";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-impostazioni',
  templateUrl: './impostazioni.page.html',
  styleUrls: ['./impostazioni.page.scss'],
})
export class ImpostazioniPage implements OnInit {
  language: any;
  user_data = {
    f_name : "",
    l_name : "",
    pic: "",
  };
  private notificationId: number;
  private myId: number = 0;
  constructor(private router: Router, private storage: StorageService, private as: ActionSheetController, private toast: ToastService, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {
    this.storage.get('user_data').then(
      (value) => {
        this.user_data.f_name = value.f_name;
        this.user_data.l_name = value.l_name;
        this.user_data.pic = value.pic;
      }
    );
  }

  changepasswordPage() {

  }

  profilePage() {
    this.router.navigate(['/profile']);
  }

  async deleteAccount() {
    const actionSheet = await this.as.create({
      header: 'Questa azione è IRREVERSIBILE, sei sicuro?',
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if(role == 'confirm'){
      let token;
      await this.storage.get('access_token').then(
        (value: any) => {
          token = value;
        }
      )
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      axios.get(environment.apiURL + 'mobile/api/patient/account/delete', config);
      this.cancel_notification();
      this.storage.clear();
      this.router.navigate(['/login']);
    }
  }

  async cleanLocalDB() {
    const actionSheet = await this.as.create({
      header: 'Sei sicuro?',
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if(role == 'confirm'){
      LocalNotifications.removeAllDeliveredNotifications();
      this.cancel_notification();
      this.storage.clear();
      //this.router.navigate(['/login']);
    }

  }

  async downloadMyData() {
    const actionSheet = await this.as.create({
      header: 'Riceverai entro 24 ore un file contenente tutto quello che abbiamo su di te, vuoi procedere ?',
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if(role == 'confirm'){
      let token;
      await this.storage.get('access_token').then(
        (value: any) => {
          token = value;
        }
      )
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      axios.get(environment.apiURL + 'mobile/api/patient/account/download', config);
      this.toast.presentToast("Entro 24 ore riceverai la tua mail :)");
    }
  }

  async cancel_notification() {
    console.log("INITING TRY-CATCH");
    try {
      const pendingList: LocalNotificationPendingList = await LocalNotifications.getPending();

      if (!pendingList || !pendingList.notifications) {
        console.log("no pending notifications");
        return;
      }

      // LocalNotificationRequest type definition wrong: https://github.com/ionic-team/capacitor/issues/947
      const notifications: LocalNotificationRequest[] = pendingList.notifications.filter((notification: LocalNotificationRequest) => {
        return notification;
      });

      // cancel not triggered on success yet: https://github.com/ionic-team/capacitor/issues/844
      await LocalNotifications.cancel({notifications: notifications});
    } catch (e) {
      console.error(e);
    }

    console.log("INITING OLD CANCEL");

    LocalNotifications.getPending().then(res => {
      res.notifications = res.notifications.filter(i => i.id == this.notificationId);
      if (res.notifications.length > 0) {
        LocalNotifications.cancel(res);
      } else {
        console.log('notification length zero');
      }
    }, err => {
      console.log(err);
    })
  }

  async cancella_notifica(myId: string) {
    try {
      const pendingList: LocalNotificationPendingList = await LocalNotifications.getPending();

      if (!pendingList || !pendingList.notifications) {
        return;
      }

      // LocalNotificationRequest type definition wrong: https://github.com/ionic-team/capacitor/issues/947
      const notifications: LocalNotificationRequest[] = pendingList.notifications.filter((notification: LocalNotificationRequest) => {
        const extra = (<any> notification).extra;
        return extra && extra.myId === myId;
      });

      // cancel not triggered on success yet: https://github.com/ionic-team/capacitor/issues/844
      await LocalNotifications.cancel({notifications: notifications});
    } catch (e) {
      console.error(e);
    }
  }
}
