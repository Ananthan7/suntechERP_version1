import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { JobcardComponent } from './jobcard/jobcard.component';
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterComponent implements OnInit {
  //variables
  menuTitle: any
  apiCtrl: any
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  //subscription variable
  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private ChangeDetector: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    this.getMasterGridData()
  }

  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      if (this.orderedItems.length > 10) {
        this.orderedItems.splice(this.orderedItems.length - this.pageSize, this.pageSize);
      }
    } 
  }
  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex = this.pageIndex + 1;
      this.getMasterGridData(this.pageIndex);
    }
  }

  //  open Jobcard in modal
  openJobcard() {
    this.modalService.open(JobcardComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });
  }

  /**USE: to get table data from API */
  getMasterGridData(pageIndex?: number) {
    //use: to get menu title from queryparams and API endpoint
    this.menuTitle = this.CommonService.getModuleName()
    if (this.orderedItems.length == 0) {
      this.snackBar.open('loading...');
    }
    this.apiCtrl = 'MasterMainGrid'
    let params = {
      "PAGENO": pageIndex || 1,
      "RECORDS": this.pageSize || 10,
      "TABLE_NAME": "DIAMOND_STOCK_MASTER",
      "CUSTOM_PARAM": ""
    }
    this.subscriptions$ = this.dataService.postDynamicAPI(this.apiCtrl, params).subscribe((resp: any) => {
      this.snackBar.dismiss();
      if (resp.dynamicData) {
        // resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
        resp.dynamicData[0].forEach((item: any, i: any) => {
          item.Id = i + 1;
        });
        if (this.orderedItems.length > 0) {
          this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
        } else {
          this.orderedItems = resp.dynamicData[0];
          this.nextPage()
        }
        // this.orderedItemsHead = Object.keys(this.orderedItems[0]);
        // this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
        //change detector code
        this.ChangeDetector.detectChanges()
      } else {
        alert('No Response Found')
      }
    }, err => {
      alert(err)
    });
  }
  //pagination change
  handlePageIndexChanged(event: any) {
    this.pageIndex = event.pageIndex;
    // Load data for the new page using the updated pageIndex
    // Update this.dataSource with the new data
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
