import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { JobcardComponent } from './jobcard/jobcard.component';
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  menuTitle: any
  apiCtrl: any
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  isLoading: boolean = false;

  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
  ) {
    
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    this.getMasterGridData()
  }
  //  open Jobcard in modal
  openJobcard(){
    this.modalService.open(JobcardComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'day-book'
    });
  }

  /**USE: to get table data from API */
  getMasterGridData() {
    //use: to get menu title from queryparams and API endpoint
    this.menuTitle = this.CommonService.getModuleName()
    this.snackBar.open('loading...');
    this.apiCtrl = 'MasterMainGrid'
    let params = {
      "PAGENO": 1,
      "RECORDS": 10,
      "TABLE_NAME": "DIAMOND_STOCK_MASTER",
      "CUSTOM_PARAM": ""
    }
    this.isLoading = true;
    this.subscriptions$ = this.dataService.postDynamicAPI(this.apiCtrl,params).subscribe((resp:any) => {
      this.snackBar.dismiss();
      console.log(resp.dynamicData);
      if (resp.dynamicData) {
        resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
        resp.dynamicData[0].forEach((item: any, i: any) => {
          item.Id = i + 1;
        });
        this.orderedItems = resp.dynamicData[0];
        this.orderedItemsHead = Object.keys(this.orderedItems[0]);
        this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
        if(this.orderedItemsHead){
          this.isLoading = false;
        }
      } else {
        alert('No Response Found')
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      alert(err)
    });
  }
  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }

// const endTime = performance.now();
      // const duration = endTime - startTime;
      // Log the duration or perform other actions
      // console.log(`API request took ${duration} milliseconds`);
      // console.log(`API request took ${duration / 1000} seconds`);
}
