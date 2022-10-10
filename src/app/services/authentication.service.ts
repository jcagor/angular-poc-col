import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Authetication, RestrictiveLists } from '../interfaces/aunthetication';
import { map } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  tokenUrl: string;
  restrictiveListsUrl: string;
  quotUrl: string;
  constructor(private http: HttpClient) {
    this.tokenUrl = 'https://webserver-lctcolmenapoc-prd.lfr.cloud/o/oauth2/token';
    this.restrictiveListsUrl = 'https://webserver-lctcolmenapoc-prd.lfr.cloud/o/colmena/consultaListas';
    this.quotUrl = 'https://webserver-lctcolmenapoc-prd.lfr.cloud/o/c/cotizacioninmuebleses/';
  }

  getAccessToken(): Authetication {
    const clientId = 'id-9ce7b52a-8444-78bc-c1b0-7e72da744f2';
    const clientSecret = 'secret-bc295c87-7b3b-8c11-024a-35aa61982e';
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('client_id', clientId);
    headers = headers.append('Client_secret', clientSecret);
    headers = headers.append('grant_type', 'client_credentials');
    const body = {
      "access_token": "d38e947eb031b0fb67e2b3384c8890a5aafaa77cf449491ff408cf1a67f6",
      "token_type": "Bearer",
      "expires_in": 604800,
      "scope": "C_CotizacionInmuebles.everything.write C_CotizacionInmuebles.everything.read Colmena.listasRestrictivas.everything.read Colmena.listasRestrictivas.everything C_CotizacionInmuebles.everything Colmena.listasRestrictivas.everything.write"
    } as Authetication;
    /*return this.http
      .post<Authentication>(this.tokenQueryUrl, JSON.stringify(body), {
        headers: headers,
      })
      .subscribe((res) => {
        console.log(res);
      });*/
    return body;
  }

  async validateRestrictiveLists(token, body) {
    const authroizationToken = 'Bearer '.concat(token);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', authroizationToken);

    return this.http
      .post<any>(this.restrictiveListsUrl, body, {
        headers: headers
      }).pipe(catchError(err => {
        throw 'error in source. Details: ' + err;
      }));
  }

  async saveQuote(token, body) {
    const authroizationToken = 'Bearer '.concat(token);

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', authroizationToken);

    return this.http
      .post<any>(this.quotUrl, body, {
        headers: headers
      }).pipe(catchError(err => {
        throw 'error in source. Details: ' + err;
      }));
  }

}
