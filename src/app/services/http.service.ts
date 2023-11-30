import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(private http: HttpClient) { }

  post(serviceName: string, data: any, token: any = "") {
    let headers;
    if( token === "" ){
      headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      );
    } else {
      headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    }
    const options = { headers: headers, withCredentials: false }
    const url = environment.apiURL + serviceName;

    return this.http.post(url, JSON.stringify(data), options);
  }

  get(serviceName:string, data:any, token: any = ""){
    let headers;
    if( token === "" ){
      headers = new HttpHeaders();
    } else {
      headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    }
    const options = { headers: headers, withCredentials: false }
    const url = environment.apiURL + serviceName;
    return this.http.get(url, options)
  }

  async savePdf(serviceName:string, token: any = ""){
    let headers;
    headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token } );

    const options = { headers: headers, withCredentials: false }
    const url = environment.apiURL + serviceName;
    await this.http.get(url, options).subscribe( (data) => {
      console.log(data);
      return data;
    });
  }
}
