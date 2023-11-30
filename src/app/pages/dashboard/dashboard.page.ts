import {Component, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, IonModal, IonRouterOutlet, LoadingController} from "@ionic/angular";
import { OverlayEventDetail } from '@ionic/core/components';
import {StorageService} from "../../services/storage.service";
import {MoodService} from "../../services/mood.service";
import {ToastService} from "../../services/toast.service";
import {Observable} from "rxjs";
import {HttpService} from "../../services/http.service";
import { Chart } from "chart.js/auto";
import {Router} from "@angular/router";
import axios from "axios";
import {environment} from "../../../environments/environment";
import {Md5} from "ts-md5";
import {each} from "chart.js/helpers";
import {Deploy} from "cordova-plugin-ionic";
import {Health} from "@awesome-cordova-plugins/health";
import {ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token} from "@capacitor/push-notifications";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  language: any;
  console = console;

  @ViewChild('barCanvas', {static: true}) barCanvas:any;

  barValues = [];
  barLabels = [];
  barChart: any;
  user_data = {
    f_name : "",
    l_name : "",
    pic: "",
  };

  temp = [];
  private graphData = [0,0,0,0,0];
  private tempData: any;
  pills: Array<any> = [];
  async ngOnInit() {
    console.log('---- INITING DASHBOARD ------');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.log("ERROR REQUEST PERMISSION", result);
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
      console.log("----LISTENER REGISTRATION ------");
      console.log("TOKEN", token);

        let fd = new FormData();
        fd.append('registration_token', token.value);
        let tt = ""
        let ss = new StorageService();
        ss.get('access_token').then(
          (value: any) => {
            tt = value;
          }
        )
        const config = {
          headers: {Authorization: `Bearer ${tt}`}
        };


        axios.post(environment.apiURL + 'mobile/api/register/notification', fd, config);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log(error);
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );

    this.routerOutlet.swipeGesture = false;
    this.moodService.retrieveMood();
    this.getMoods();
    this.storage.get('user_data').then(
      (value) => {
        this.user_data.f_name = value.f_name;
        this.user_data.l_name = value.l_name;
        this.user_data.pic = value.pic;
      }
    );

    this.getMyPills();
    this.getMyDoctor();
    this.dummyChart();
    await this.getDummyData()
    this.barChart.update();
    this.retrievePassi();
    this.checkUpdates();
  }

  async checkUpdates(){
    const update = await Deploy.checkForUpdate()

    if (update.available){
      alert("C'è una nuova versione dell'app disponibile. " +
        "Vai alla sezione Aggiornamenti App");
    }
  }
  async getMyPills(){
    let token;

    await this.storageService.get('access_token').then(
      (value: any) => {
        token = value;
      }
    )
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    this.pills = [];
    await axios.get(environment.apiURL + 'mobile/api/patient/drug/list', config).then((drugs) => {
      each(drugs.data, (a, b) => {

        return this.pills.push(a);
      });
      this.storageService.store('my_pills', this.pills);
    })
      .catch((error) => {
        console.log('axios error', error);
      });

  }
  async dummyChart() {
    if(typeof this.barChart !== "undefined" ){
      await this.getDummyData().then(()=>{
        this.barChart.destroy();
      })
    }
    await this.getDummyData()

    // @ts-ignore
    const ctx = document.getElementById('myChart').getContext('2d');


    this.barChart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'doughnut',

      // The data for our dataset
      data: {
        labels: this.barLabels,
        datasets: [{
          backgroundColor: [
            '#ffbe16',
            '#d56964',
            '#f6ddbd',
            '#562b6f',
            'rgb(122,148,176)',
            'rgb(68,40,188)',
          ],
          data: this.barValues
        }
        ]
      },

      // Configuration options go here
      options: {
        // @ts-ignore
        tooltips: {
          // @ts-ignore
          mode: 'index'
        }
      }
    })}


//Fetch Data from API

  async getDummyData() {
    const requestHeaders: HeadersInit = new Headers();
    const jwt_token  = await this.storage.get('access_token').then(token => { return token; });
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('Authorization', 'Bearer ' + jwt_token);
    const apiUrl = environment.apiURL + "mobile/api/last_10_mood/graph"
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: requestHeaders
    })

    const barChatData = await response.json()
    const lbl = barChatData[0].map((x: { x: any; }) => x.x)
    const val = barChatData[0].map((x: { y: any; }) => x.y);
    this.barLabels = lbl;
    this.barValues = val;
  }

  @ViewChild(IonModal) modal: IonModal;

  elencoMoods:any;

  today = Date.now();

  asd: string;


  constructor(private routerOutlet: IonRouterOutlet, private storageService: StorageService, private actionSheetCtrl: ActionSheetController, private httpService: HttpService, private storage: StorageService, public moodService: MoodService,private toastService: ToastService, private loadingCtrl: LoadingController, private router: Router, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async getMoods(){
    this.barValues = [];
    this.barLabels = [];
    this.tempData = [];
    const jwt_token  = await this.storage.get('access_token').then(token => { return token; });
    let data: Observable<any> = this.httpService.get('mobile/api/last_10_mood/graph', null, jwt_token);
    data.subscribe(result  => {
      if(result[0].length > 0) {
        // @ts-ignore
        result[0].forEach( (value) => {
          this.tempData.push(value);
        });
      }
    })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm(mood_level: any) {
    this.modal.dismiss(mood_level, 'confirm');
  }

  async onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    if (ev.detail.role === 'confirm') {
      let my_mood = {
        'mood':ev.detail.data,
        'ts': Date.now()
      }

      this.storage.store("my_mood", my_mood );

      this.moodService.addMood(ev.detail.data,0);
      await this.getDummyData()
      this.barChart.update();
      //this.barChart.update();
      loader.dismiss();
      this.ngOnInit();
    } else {
      loader.dismiss();
    }
  }

  eliminaMood = async (trk_id:number) => {
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
      this.moodService.deleteMood(trk_id);
      this.ngOnInit();
    } else {
      this.toastService.presentToast("Felice che hai cambiato idea");
    }

  };
  mood = {value:"", ws: ""  }
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
  today_steps: any = "0";

  profilePage() {
    this.router.navigate(['/profile']);
  }

  onItemChange(target: any) {

  }

  async onSubmit(form: { value: any; }) {
    if(form.value.selector.length === 0){
      this.toastService.presentToast("Devi selezionare un mood");
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });

    loader.present();
      let my_mood = {
        'mood':form.value.selector,
        'w_sign': form.value.comment,
        'ts': Date.now()
      }

      this.storage.store("my_mood", my_mood );
      this.moodService.addMood(form.value.selector,form.value.comment);

      this.modal.dismiss(null, 'cancel');

      if(this.barChart !== undefined){
        this.barChart.update();
      }

      loader.dismiss();
      await this.dummyChart();


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
      // @ts-ignore
      this.myDoc.photo = "https://www.gravatar.com/avatar/" + Md5.hashStr(this.myDoc.email);
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
        loader.dismiss();
      });

    loader.dismiss();
  }

  getObiettivi(){}
  getLocations(){}

  addUmore() {

  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    }).catch(function(e){
      console.log("Exception", e);
      event.target.complete();
    });
  }

  async retrievePassi() {

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });

    loader.present();

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
    ).catch(e => {
      loader.dismiss();
      console.log(e);
    })


    Health.query({
      startDate: new Date(new Date().getTime() - 10*24*60*60*1000 ),
// ten days ago
      endDate: new Date(), // now
      dataType: 'steps',
      limit: 10
    }).then( async data => {
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
      this.today_steps = data[0].value;
      axios.post(environment.apiURL + 'mobile/api/patient/health/passi', fd, config);
      loader.dismiss();
    }).catch(e => {
      console.log(e);
      loader.dismiss();
    })
  }
}
