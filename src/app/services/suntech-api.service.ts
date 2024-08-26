import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuntechAPIService {
  baseUrl: any;
  DBBranch: any = localStorage.getItem('userbranch')
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
         // Add the DBBranch query parameter
        const response = this.http.get(apiUrl+apiName+`/${this.DBBranch}`);
        return response
      })
    );
  }
  // use: dynamic function for get API data 
  getDynamicAPIwithParams(apiName: string,queryParams:any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap((config:any) => {
        const apiUrl = config.baseUrl;
        let params = new HttpParams().set('DBBranch', `${this.DBBranch}`);
        if (queryParams) {
          for (const key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
              params = params.set(key, queryParams[key]);
            }
          }
        }
        const response = this.http.get(apiUrl+apiName,{params});
        return response
      })
    );
  }
  // use: dynamic function for post API data 
  postDynamicAPI(apiName: string, data: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        let params = new HttpParams().set('DBBranch', `${this.DBBranch}`);
        return this.http.post(apiUrl+apiName+`/${this.DBBranch}`, data);
      })
    );
  }
 
  // use: dynamic function for put API data 
  putDynamicAPI(apiName: string, data: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        return this.http.put(apiUrl+apiName+`/${this.DBBranch}`, data);
      })
    );
  }
  // use: dynamic function for delete API data 
  deleteDynamicAPI(apiName: string, data?: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        return this.http.delete(apiUrl+apiName+`/${this.DBBranch}`, data);
      })
    );
  }

  // use: dynamic function for get API data 
  getDynamicAPICustom(apiName: string): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap((config:any) => {
        const apiUrl = config.baseUrl;
        const response = this.http.get(apiUrl+apiName);
        return response
      })
    );
  }
  // use: dynamic function for get API data 
  getDynamicAPIwithParamsCustom(apiName: string,params:any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap((config:any) => {
        const apiUrl = config.baseUrl;
        const response = this.http.get(apiUrl+apiName,{params: params});
        return response
      })
    );
  }
  // use: dynamic function for post API data 
  postDynamicAPICustom(apiName: string, data: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        console.log(config.baseUrl,'config.baseUrl');
        
        const apiUrl = config.baseUrl;
        return this.http.post(apiUrl+apiName, data);
      })
    );
  }

    // use: API for Paramter Details 
    gettingParameterDetails(apiName: string, data: any): Observable<any> {
      return this.configService.getConfig().pipe(
        switchMap(config => {
          const apiUrl = "http://5.195.165.122:108/api/";
          return this.http.post(apiUrl+apiName, data);
        })
      );
    }
 
  // use: dynamic function for put API data 
  putDynamicAPICustom(apiName: string, data: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        return this.http.put(apiUrl+ apiName, data);
      })
    );
  }

  
  // use: dynamic function for delete API data 
  deleteDynamicAPICustom(apiName: string, data?: any): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        const apiUrl = config.baseUrl;
        return this.http.delete(apiUrl+ apiName, data);
      })
    );
  }

  // use: dynamic function for get API data without branch 
  getDynamicAPIWithoutBranch(apiName: string): Observable<any> {
    return this.configService.getConfig().pipe(
      switchMap((config:any) => {
        const apiUrl = config.baseUrl;
         // Add the DBBranch query parameter
        const response = this.http.get(apiUrl+apiName);
        return response
      })
    );
  }
}
