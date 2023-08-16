import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
@Component({
  selector: 'app-retail-master',
  templateUrl: './retail-master.component.html',
  styleUrls: ['./retail-master.component.scss']
})
export class RetailMasterComponent implements OnInit {
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
    this.getMasterGridData()
  }
  /**USE: to get table data from API */
  getMasterGridData() {
    //use: to get menu title from queryparams and API endpoint
    this.menuTitle = this.CommonService.getModuleName()
    this.apiCtrl = this.CommonService.getqueryParamAPI()
    this.snackBar.open('loading...');
    this.isLoading = true;
    let params: any = { "PageNumber": 1, "PageSize": 10 }
    let API: string = `${this.apiCtrl}?strBranchCode=${this.CommonService.branchCode}&strVocType=${'POS'}&strYearMonth=${'2024'}`
    this.subscriptions$ = this.dataService.postDynamicAPI(API, params)
      .subscribe((resp: any) => {
        this.isLoading = false;
        this.snackBar.dismiss();
        if (resp.response) {
          this.orderedItems = resp.response;
        } else {
          this.orderedItems = [];
          // Calling the DT trigger to manually render the table
        }
      }, err => {
        this.isLoading = false;
        alert(err)
      });

  }
  //  open Jobcard in modal
  openMadalView() {
    // this.modalService.open(JobcardComponent, {
    //   size: 'xl',
    //   backdrop: true,
    //   keyboard: false,
    //   windowClass: 'day-book'
    // });
  }

  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }
}
