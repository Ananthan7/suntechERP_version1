import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SuntechAPIService } from './suntech-api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private planetUpdateTagSubject = new Subject<any>();
  private intervalId: any;

  constructor(private suntechApi: SuntechAPIService) {
    this.planetUpdateTagSubject.subscribe((res) => {
      console.log('File generated:', res);
    });
  }

  getPlanetPOSUpdateTag(strBranchcode: string, vocType: string, baseYear: string, fcn_voc_no: string): void {
    const API = `POSPlanetFile/GetPlanetPOSUpdateTag/${strBranchcode}/${vocType}/${baseYear}/${fcn_voc_no}`;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.suntechApi.getDynamicAPI(API).subscribe((res: any) => {
        if (res.status === 'Success' && res.planetInfo.StatusCode==12) {

          this.planetUpdateTagSubject.next(res);
          clearInterval(this.intervalId); 
        }
      });
    }, 10000); 
  }
}
