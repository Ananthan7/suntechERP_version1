import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ActivatedRoute } from '@angular/router';
import { DiamondSalesorderComponent } from './diamond-salesorder/diamond-salesorder.component';
import { DiamondQuotationComponent } from './diamond-quotation/diamond-quotation.component';
import { JobCardComponent } from './job-card/job-card.component';
import { MetalIssueComponent } from './metal-issue/metal-issue.component';
import { WaxProcessComponent } from './wax-process/wax-process.component';
import { StoneIssueComponent } from './stone-issue/stone-issue.component';
import { CADProcessingComponent } from './cad-processing/cad-processing.component';
import { MetalReturnComponent } from './metal-return/metal-return.component';
import { StoneReturnComponent } from './stone-return/stone-return.component';
import { WaxProcessReturnComponent } from './wax-process-return/wax-process-return.component';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { CastingTreeUpComponent } from './casting-tree-up/casting-tree-up.component';
import { MeltingIssueComponent } from './melting-issue/melting-issue.component';
import { ProcessTransferComponent } from './process-transfer/process-transfer.component';
import { JewelleryAltrationComponent } from './jewellery-altration/jewellery-altration.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  //variables
  menuTitle: any;
  PERMISSIONS: any;
  tableName: any;
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  //subscription variable
  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    this.getMasterGridData()
    // this.openModalView()
  }

  viewRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'VIEW'
    this.openModalView(str)
  }
  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openModalView(str)
  }
  //  open forms in modal
  //  open Jobcard in modal
  openModalView(data?: any) {
    let contents;
    switch (this.menuTitle) {
      case 'Diamond Sales Order':
        contents = DiamondSalesorderComponent
        break;
      case 'Diamond Quotation':
        contents = DiamondQuotationComponent
        break;
      case 'Job Card':
        contents = JobCardComponent
        break;
      case 'Metal Issue (diamond Jewellery)':
        contents = MetalIssueComponent
        break;
      case 'Waxing Process Issue':
        contents = WaxProcessComponent
        break;
      case 'Stone Issue (diamond Jewellery)':
        contents = StoneIssueComponent
        break;
      case 'CAD Process (CAD)':
        contents = CADProcessingComponent
        break;
      case 'Metal Return (diamond Jewellery)':
        contents = contents = MetalReturnComponent
        break;
      //continue adding components using case then break    

      case 'Stone Return (diamond Jewellery)':
        contents = StoneReturnComponent
        break;
      case 'Waxing Process Return':
        contents = WaxProcessReturnComponent
        break;
      case 'JOB CREATION':
        contents = JobCreationComponent
        break;
      case 'Casting Tree Up (TMU)':
        contents = CastingTreeUpComponent
        break;
      case 'Melting Issue':
        contents = MeltingIssueComponent
        break;  
        case 'Quotation Processing':
          contents = JewelleryAltrationComponent
          break;
  
      case 'Process Transfer (MFG)':
        contents = ProcessTransferComponent
        break;  
      //continue adding components using case then break
      default:
        alert('Module Not found')
    }

    const modalRef: NgbModalRef = this.modalService.open(contents, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;
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
  nextCall: any = 0
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
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.tableName = data.HEADER_TABLE;
      this.PERMISSIONS = data.PERMISSION;
    } else {
      this.menuTitle = this.CommonService.getModuleName()
      this.tableName = this.CommonService.getqueryParamTable()
    }

    if (this.orderedItems.length == 0) {
      this.snackBar.open('loading...');
    }

    this.apiCtrl = 'TransctionMainGrid'
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

    this.subscriptions$ = this.dataService.postDynamicAPI(this.apiCtrl, params)
      .subscribe((resp: any) => {
        this.snackBar.dismiss();
        if (resp.dynamicData) {
          // resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
          resp.dynamicData[0].forEach((obj: any, i: any) => {
            obj.Id = i + 1;
            for (const prop in obj) {
              if (typeof obj[prop] === 'object' && Object.keys(obj[prop]).length === 0) {
                // Replace empty object with an empty string
                obj[prop] = '';
              }
            }
          });
          if (this.orderedItems.length > 0) {
            this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
          } else {
            this.orderedItems = resp.dynamicData[0];
            if(this.orderedItems.length == 10){
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
      }, err => {
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

  // const endTime = performance.now();
  // const duration = endTime - startTime;
  // Log the duration or perform other actions
  // console.log(`API request took ${duration} milliseconds`);
  // console.log(`API request took ${duration / 1000} seconds`);
}
