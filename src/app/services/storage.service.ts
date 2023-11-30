import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async store(storageKey: string, value: any) {
    const encryptedValue = btoa(escape(JSON.stringify(value)));
    await Preferences.set({
      key: storageKey,
      value: encryptedValue
    });
  }
  async get(storageKey: string) {
    const ret = await Preferences.get({ key: storageKey });
    try {
      let decr = JSON.parse(unescape(atob(<string>ret.value)));
      return decr;
    } catch (e){
      return false;
    }
  }

  async removeStorageItem(storageKey: string) {
    await Preferences.remove({ key: storageKey });
  }

// Clear storage
  async clear() {
    await Preferences.clear();
  }
}
