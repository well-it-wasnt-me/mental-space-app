import { Injectable } from '@angular/core';
import { StorageService } from "./storage.service";
import { DatePipe } from "@angular/common";
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  constructor(private storage: StorageService, private httpService: HttpService, private toastService: ToastService) { }

  mood = {
    'image' : "assets/mental-space-logo/png/logo-no-background.png",
    'slogan': "Ancora non hai inserito alcuna emozione, non è mai troppo tardi !",
    'type'  : "PRIMA O POI TE LO DICO",
    'ts'    : Date.now()
  }

  async retrieveMood(){
    let lastMood : any = await this.storage.get("my_mood");

    switch (lastMood.mood) {
      case 1: {
        this.mood.image = "https://www.wallquotes.com/sites/default/files/styles/uc_canvas/public/insp0563_02.png?itok=f5Zjaydx";
        this.mood.slogan = "Complimenti ! Hai raggiunto un traguardo davvero importante."
        this.mood.type = "OTTIMO"
        this.mood.ts = lastMood.ts
        break;
      }
      case 2: {
        this.mood.image = "https://thumbs.dreamstime.com/b/feeling-good-lettering-colorful-phrase-vector-illustration-isolated-blue-background-design-banner-poster-web-feeling-172622659.jpg";
        this.mood.slogan = "Continua così ! Sei sulla strada giusta."
        this.mood.type = "BUONO"
        this.mood.ts = lastMood.ts
        break;
      }
      case 3: {
        this.mood.image = "https://i1.sndcdn.com/artworks-000660499054-fobpbo-t500x500.jpg";
        this.mood.slogan = "Sei in uno stato normale, non avvilirti che vai bene così"
        this.mood.type = "STABILE"
        this.mood.ts = lastMood.ts
        break;
      }
      case 4: {
        this.mood.image = "https://cdn.tinybuddha.com/wp-content/uploads/2014/03/Woman-with-umbrella.jpg";
        this.mood.slogan = "Sentirsi un po giù può succedere. Il segreto sta nel non pensarci troppo !"
        this.mood.type = "BASSO"
        this.mood.ts = lastMood.ts
        break;
      }
      case 5: {
        this.mood.image = "https://www.thesimpledollar.com/wp-content/uploads/2016/06/twenty20_dfd6cd52-d788-4f67-92f2-e2dc29966eed.jpg";
        this.mood.slogan = "Stare male...è davvero brutto. Ma approfittane per ascoltarti. Scrivi come ti senti e cosa ti ha portato a questo momento"
        this.mood.type = "DEPRESSO"
        this.mood.ts = lastMood.ts
        break;
      }

      default: {
        this.mood.image = "assets/mental-space-logo/png/logo-no-background.png";
        this.mood.slogan = "Ancora non hai inserito alcuna emozione, non è mai troppo tardi !"
        this.mood.type = "PRIMA O POI TE LO DICO"
        this.mood.ts = Date.now();
      }
    }
  }

  async addMood(mood_id: string | undefined, w_sign: number) {
    const jwt_token  = await this.storage.get('access_token').then(token => { return token});

    this.httpService.post('mobile/api/mood', {
      "ts": Date.now(),
      "mood_id": mood_id,
      "warning_sign": w_sign
    }, jwt_token).subscribe(
      (res:any) => {
        if (res.status == 'success') {
          this.toastService.presentToast("Aggiunto con successo !");
        } else {
          this.toastService.presentToast("Qualcosa è andato storto!");
        }
      },
      (error:any) => {
        this.toastService.presentToast("Qualcosa è andato decisamente male!");
      }
    );

  }

  async deleteMood(mood_id: number) {
    const jwt_token  = await this.storage.get('access_token').then(token => { return token});

    this.httpService.get('mobile/api/mood/delete/'+mood_id, {}, jwt_token).subscribe(
      (res:any) => {
        if (res.status == 'success') {
          this.toastService.presentToast("Eliminato con successo !");
        } else {
          this.toastService.presentToast("Qualcosa è andato storto!");
        }
      },
      (error:any) => {
        this.toastService.presentToast("Qualcosa è andato decisamente male!");
      }
    );

  }
}
