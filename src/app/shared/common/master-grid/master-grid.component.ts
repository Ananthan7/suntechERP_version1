import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'master-grid',
  templateUrl: './master-grid.component.html',
  styleUrls: ['./master-grid.component.scss']
})
export class MasterGridComponent implements OnInit {
  @Input() MasterGridData!: any;
  @Output() editRowClick = new EventEmitter<any>();
  @Output() viewRowClick = new EventEmitter<any>();
  @Output() AddBtnClick = new EventEmitter<any>();

  menuTitle: any;
  PERMISSIONS: any;
  @Input()tableName: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  nextCall: any = 0
  //subscription variable
  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    // private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.getMasterGridData()
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    // this.openModalView()
  }

  addButtonClick() {
    this.AddBtnClick.emit();
  }
  viewRowDetails(e: any) {
    this.viewRowClick.emit(e);
  }
  editRowDetails(e: any) {
    this.editRowClick.emit(e);
  }

  onContentReady(e: any) {
    setTimeout(() => {
      let scroll = e.component.getScrollable();
      scroll.on("scroll", (event: any) => {
        console.log(event, "scrolling");
        const container = event.scrollOffset;

        if (container.top >= 310) {
          this.nextPage()
        }

      })
    })
  }
 
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

      this.getMasterGridData();
    }
  }
  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.pageIndex = 1;
      this.orderedItems = [];
      this.orderedItemsHead = [];
      this.tableName = data.HEADER_TABLE;
    } else {
      this.tableName = this.CommonService.getqueryParamTable()
    }

    if (this.orderedItems.length == 0) {
      this.snackBar.open('loading...');
    }

    let params = {
      "PAGENO": this.pageIndex || 1,
      "RECORDS": this.pageSize || 10,
      "TABLE_NAME": this.tableName,
      "CUSTOM_PARAM": {
        // "FILTER": {
        //   "YEARMONTH": localStorage.getItem('YEAR') || '',
        //   "BRANCHCODE": this.CommonService.branchCode,
        //   "VOCTYPE": ""
        // },
        "TRANSACTION": {
          "VOCTYPE": this.CommonService.getqueryParamVocType() || "",
        }
      }
    }

    this.subscriptions$ = this.dataService.postDynamicAPI('TransctionMainGrid', params)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        if (resp.dynamicData) {
          // resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
          resp.dynamicData[0].forEach((obj: any, i: any) => {

            for (const prop in obj) {
              if (typeof obj[prop] === 'object' && Object.keys(obj[prop]).length === 0) {
                // Replace empty object with an empty string
                obj[prop] = '';
              }
            }
          });
          if (this.orderedItems.length > 0) {
            this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
            console.log(...resp.dynamicData[0], 'resp.dynamicData[0]');

            // this.orderedItems.push(...resp.dynamicData[0]);

          } else {
            this.orderedItems = resp.dynamicData[0];
            if (this.orderedItems.length == 10) {
              this.nextPage()
            }
          }
          this.orderedItemsHead = Object.keys(this.orderedItems[0]);
          this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
          //change detector code
          // this.ChangeDetector.detectChanges()
        } else {
          this.snackBar.open('No Response Found!', 'Close', {
            duration: 3000,
          });
        }
      }, (err:any) => {
        this.snackBar.open(err, 'Close', {
          duration: 3000,
        });
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
}