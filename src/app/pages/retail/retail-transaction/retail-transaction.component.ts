import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { NewPosEntryComponent } from './new-pos-entry/new-pos-entry.component';

@Component({
  selector: 'app-retail-transaction',
  templateUrl: './retail-transaction.component.html',
  styleUrls: ['./retail-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RetailTransactionComponent implements OnInit {
  //variables
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
    private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
  }

  ngOnInit(): void {
    this.getMasterGridData()
    this.openMadalView()
  }
  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index
  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
    } 
  }
  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex = this.pageIndex + 1;
      this.getMasterGridData(this.pageIndex);
    }
  }
  /**USE: to get table data from API */
  getMasterGridData(pageIndex?:number) {
    //use: to get menu title from queryparams and API endpoint
    this.menuTitle = this.CommonService.getModuleName()
    this.apiCtrl = this.CommonService.getqueryParamAPI()
    this.snackBar.open('loading...');
    this.isLoading = true;
    let params: any = { "PageNumber": 1, "PageSize": 10 }
    let API: string = `${this.apiCtrl}?strBranchCode=${this.CommonService.branchCode}&strVocType=${'POS'}&strYearMonth=${this.CommonService.yearSelected}`
    this.subscriptions$ = this.dataService.postDynamicAPI(API, params)
      .subscribe((resp: any) => {
        this.isLoading = false;
        this.snackBar.dismiss();
        if (resp.response) {
          resp.response.forEach((item: any, i: any) => {
            item.Id = i + 1;
          });
          this.orderedItems = resp.response;
          this.ChangeDetector.detectChanges() //detect dom change
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
    this.modalService.open(NewPosEntryComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });
    // const modalOptions = {
    //   windowClass: 'custom-modal', // This is the custom class you created
    // };

  }

  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }


  
}
