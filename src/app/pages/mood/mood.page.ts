import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {MoodService} from "../../services/mood.service";
import {Observable} from "rxjs";
import {HttpService} from "../../services/http.service";
import {ActionSheetController, IonModal, LoadingController, ModalController} from "@ionic/angular";
import {ToastService} from "../../services/toast.service";
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mood',
  templateUrl: './mood.page.html',
  styleUrls: ['./mood.page.scss'],
})
export class MoodPage implements OnInit {
  language: any;
  public loaded = false;
  @ViewChild(IonModal) modal: IonModal;
  displayStyle = "none";
  user_data = {
    f_name: "",
    l_name: "",
    pic: ""
  };
  mood={value: 0, ws: undefined
  };
  public elencoMoods: any;
  selectedEv = {
    value:"",
    effective_datetime: "",
    warning_sign: ""
  };

  constructor(private actionSheetCtrl: ActionSheetController, private toastService: ToastService, private loadingCtrl: LoadingController, private storage: StorageService, private moodService: MoodService, private httpService: HttpService, private modalCtrl: ModalController, private translateConfigService: TranslateConfigService, private translate: TranslateService) {
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  async ngOnInit() {
    this.loaded = false;
    this.storage.get('user_data').then(
      (value) => {
        this.user_data.f_name = value.f_name;
        this.user_data.l_name = value.l_name;
        this.user_data.pic = value.pic;
      }
    );

    this.moodService.retrieveMood();
    this.getMoods();
  }

  async getMoods(){
    const jwt_token  = await this.storage.get('access_token').then(token => { return token; });
    let data: Observable<any> = this.httpService.get('mobile/api/last_10_mood', null, jwt_token);
    data.subscribe(result  => {
      if(result[0].length > 0){
        this.elencoMoods = result[0];
        this.loaded = true;
      } else {
        this.elencoMoods = false;
        this.loaded = true;
      }
    })
  }

  onItemChange(value: any) {
    console.log(" Value is : ", value.value );
  }

  cancel() {
    this.modal.dismiss();
  }

  onWillDismiss($event: any) {

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

  openModal(mood: any) {
    this.selectedEv = mood;
    this.displayStyle = "block";
  }

  closeModal() {
    this.displayStyle = "none";
  }
  async onSubmit(form: { value: any; }) {
    this.loaded = false;
    console.log(form.value.selector);
    console.log(form.value.comment);

    if(form.value.selector.length === 0){
      this.toastService.presentToast("Devi selezionare un mood");
      this.loaded = true;
      return;
    }

    const loader = await this.loadingCtrl.create({
      message: 'Caricamento...',
      spinner: 'circles',
    });
    loader.present();
    let my_mood = {
      'mood':form.value.selector,
      'w_sign': "",
      'ts': Date.now()
    }

    this.storage.store("my_mood", my_mood );
    this.moodService.addMood(form.value.selector,form.value.comment);
    loader.dismiss();
    this.modal.dismiss(null, 'cancel');
    this.ngOnInit();

  }

  handleRefresh(event: any) {
    this.ngOnInit().then(()=>{
      event.target.complete();
    });
  }
}
