import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = '../../assets/config.json';

  constructor(private http: HttpClient) {}
  /**to get base url from config.json file in asset folder */
  getConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }
}
