import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import {AuthConstants} from "../config/auth-constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpService: HttpService,
              private storageService: StorageService,
              private router: Router) { }

  login(postData: any): Observable<any> {
    return this.httpService.post('user_login', postData);
  }

  signup(postData: any): Observable<any> {
    return this.httpService.post('signup', postData);
  }

  logout() {
    this.storageService.removeStorageItem('access_token').then(res => {
      this.router.navigate(['/login']);
    });
  }
}
