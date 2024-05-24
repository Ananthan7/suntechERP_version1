import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuntechAPIService {
  baseUrl: any;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  // use: dynamic function for get API data 
  getDynamicAPI(apiName: string): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap((config:any) => {
        const apiUrl = config.baseUrl;
        const response = this.http.get(apiUrl+apiName);
        return response
      })
    );
  }
  // use: dynamic function for get API data 
  getDynamicAPIwithParams(apiName: string,params:any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap((config:any) => {
        const apiUrl = config.baseUrl;
        const response = this.http.get(apiUrl+apiName,{params: params});
        return response
      })
    );
  }
  // use: dynamic function for post API data 
  postDynamicAPI(apiName: string, data: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        console.log(config.baseUrl,'config.baseUrl');
        
        const apiUrl = config.baseUrl;
        return this.http.post(apiUrl+ apiName, data);
      })
    );
  }
 
  // use: dynamic function for put API data 
  putDynamicAPI(apiName: string, data: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        return this.http.put(apiUrl+ apiName, data);
      })
    );
  }
  // use: dynamic function for delete API data 
  deleteDynamicAPI(apiName: string, data?: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        return this.http.delete(apiUrl+ apiName, data);
      })
    );
  }
}
