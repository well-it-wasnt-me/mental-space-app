import {Component, OnInit, ViewChild} from '@angular/core';
import axios from "axios";
import {OverlayEventDetail} from "@ionic/core/components";
import {ActionSheetController, IonModal} from "@ionic/angular";
import {StorageService} from "../../services/storage.service";
import {environment} from "../../../environments/environment";
import {ToastService} from "../../services/toast.service";
import {
  LocalNotificationPendingList,
  LocalNotificationRequest,
  LocalNotifications,
  ScheduleOptions
} from "@capacitor/local-notifications";
import {each} from "chart.js/helpers";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pills',
  templateUrl: './pills.page.html',
  styleUrls: ['./pills.page.scss'],
})
export class PillsPage implements OnInit {
  language:any;
  pills: Array<any> = [];

  @ViewChild(IonModal) modal: IonModal;
  private term: string;
  constructor(private storageService: StorageService, private toastCtrl: ToastService, private actionSheetCtrl: ActionSheetController, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async loadPills(){
    let token;
    await this.storageService.get('access_token').then(
      (value) => {
        token = value;
      }
    )

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };


    if ( this.term?.length > 2 ){
      axios.get(environment.apiURL + "mobile/api/drugs/list/search/" + this.term, config)
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          console.log('axios error', error);
        });
    }

  }

  onWillDismiss($event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'confirm') {

    } else {

    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  keyword = 'denom';
  data = [];
  notFound: any = "Farmaco non trovato";
  minQuery: number = 3;
  selectedPill: any;

  temp = [];
  selectedTime: any;
  hideFrequenza: boolean = false;
  hideOraSingola: boolean = false;
  hideOraDoppia: boolean = false;
  hideScorta: boolean = false;
  selectedFreque: any;
  oraPrimaDoseSingola: any;
  oraPrimaDoseDoppia: any;
  qtSecondaDoseDoppia: any;
  oraSecondaDoseDoppia: any;
  qtPrimaDoseDoppia: any;
  displayStyle: string = 'none';
  modalSelectedPill: any = {
    principio_attivo : "",
    descrizione_gruppo: "",
    denom: "",
    prezzo: ""
  };



  selectEvent(item: any) {
    console.log("item", item);
  }

  onChangeSearch(val: string) {
    this.term = val;
    this.loadPills();
  }

  onFocused(e:any){
    return;
  }

  addPill() {
    this.hideFrequenza = true;
  }


  async ngOnInit() {
    let token;

    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await axios.get(environment.apiURL + 'mobile/api/patient/drug/list', config).then((drugs) => {
      each(drugs.data, (a, b) => {
        // @ts-ignore
        return this.pills.push(a);
      });
      this.storageService.store('my_pills', this.temp);
    })
      .catch((error) => {
        console.log('axios error', error);
      });
  }


  async setNotification(_every: any, _hour: number, _min: number, _pill_name: string, _myPill: any) {
    await LocalNotifications.requestPermissions().then(
      (reqPerm) =>
        console.log("reqPerm", reqPerm)
    )

    await LocalNotifications.checkPermissions()
      .then(
        async (res) => {
          if(res.display === 'denied'){
            alert("Attenzione, i permessi per le notifiche non ci sono. Vai nelle impostazioni del tuo telefono ed abilita");
          }
        });

    let randomId = Math.floor(Math.random() * 1000);
    const t = new Date();
    t.setHours(_hour, _min);
    await LocalNotifications.schedule(<ScheduleOptions><unknown>{
      notifications: [{
        id: randomId,
        title: "Promemoria Pillole",
        body: "Ricordati di assumere " + _pill_name,
        schedule: {
          at: t,
          allowWhileIdle: true,
          every: _every,
          repeats: true
        },
        extra: {
          myId: _myPill.id
        }
      }]
    }).then( (res)=> console.log("esito schedule", res));
    _myPill.notif_id = randomId;
    this.storageService.store("my_pills", _myPill);
  }
  getFormattedDate(dateString: string | number | Date, _hour: number, _min: number | undefined) {
    var date = new Date(dateString);
    date.setHours(_hour, _min, 0);   // Set hours, minutes and seconds
    return date.toString();
  }
  selectedFreq() {
    if(this.selectedFreque === 'once'){
      this.hideOraSingola = true;
      this.hideOraDoppia = false;
    } else if (this.selectedFreque === 'twice'){
      this.hideOraSingola = false;
      this.hideOraDoppia = true;
    } else {
      this.hideOraSingola = false;
      this.hideOraDoppia = false;
      return;
    }
  }

  async salvaPromemoria() {
    this.selectedPill.oraPrimaDoseSingola = this.oraPrimaDoseSingola;
    this.selectedPill.oraPrimaDoseDoppia = this.oraPrimaDoseDoppia;
    this.selectedPill.oraSecondaDoseDoppia = this.oraSecondaDoseDoppia;
    if( this.selectedFreque === 'once'){
      this.selectedPill.scheduled = 'Una volta al giorno';
    } else {
      this.selectedPill.scheduled = 'Più volte al giorno';
    }

    let appo = Array.of(this.selectedPill)
    // @ts-ignore
    this.pills.push(this.selectedPill);
    console.log("this.pills",this.pills);


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
    fd.append('farm_id', this.selectedPill.id)
    fd.append('oraPrimaDoseDoppia', this.selectedPill.oraPrimaDoseDoppia || "")
    fd.append('oraPrimaDoseSingola', this.selectedPill.oraPrimaDoseSingola || "")
    fd.append('oraSecondaDoseDoppia', this.selectedPill.oraSecondaDoseDoppia || "")
    fd.append('scheduled', this.selectedPill.scheduled || "")

    await axios.post(environment.apiURL + 'mobile/api/patient/drug/add',fd, config);

    if(this.selectedFreque === 'once') {
      let time = this.oraPrimaDoseSingola;
      let split = time.split(':');
      let Hour = split[0]
      let Min = split[1];

      this.setNotification("day", Hour, Min, this.selectedPill.denom, this.pills);
      this.modal.dismiss();
      this.toastCtrl.presentToast("Promemoria Salvato con Successo");
    } else if (this.selectedFreque == 'twice'){
      let time = this.oraPrimaDoseDoppia;
      let split = time.split(':');
      let Hour = split[0];
      let Min = split[1];

      this.setNotification("day", Hour, Min, this.selectedPill.denom, this.pills);
      let time2 = this.oraSecondaDoseDoppia;
      let split2 = time2.split(':');
      let Hour2 = split2[0];
      let Min2 = split2[1];

      this.setNotification("day", Hour2, Min2, this.selectedPill.denom, this.pills);
      this.modal.dismiss();
      this.toastCtrl.presentToast("Promemoria Salvato con Successo");
    }

    this.modal.dismiss();
  }

  async deletePill(id: number) {
    const actionSheet = await this.actionSheetCtrl.create({
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
      //@ts-ignore
      this.cancella_notifica(this.pills.id);
      // @ts-ignore
      this.pills.splice(this.pills.findIndex(item => item['id'] === id),1);
      this.storageService.store('my_pills', this.pills);
      let token;
      await this.storageService.get('access_token').then(
        (value: any) => {
          token = value;
        }
      )
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.get(environment.apiURL + 'mobile/api/patient/drug/delete/' + id, config).then((drugs) => {
          this.toastCtrl.presentToast("Eliminato con successo");
        })
        .catch((error) => {
          console.log('axios error', error);
        });

    }

  }

  pillDetail(data: any) {
    this.modalSelectedPill = data;
    this.displayStyle = "block";
  }

  closeModal() {
    this.displayStyle = "none";
  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
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
