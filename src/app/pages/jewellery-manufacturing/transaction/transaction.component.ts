import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';

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
import { MeltingProcessComponent } from './melting-process/melting-process.component';
import { ProductionMfgComponent } from './production-mfg/production-mfg.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  //variables
  menuTitle: any;
  PERMISSIONS: any;
  tableName: any;

  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.getMasterGridData()
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
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
      case 'Melting Process (MLP)':
        contents = MeltingProcessComponent
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
        contents = MetalReturnComponent
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
      case 'Production (MFG)':
        contents = ProductionMfgComponent
        break;
      //continue adding components using case then break
      default:
        this.snackBar.open('Module Not Created', 'Close', {
          duration: 3000,
        });
    }

    const modalRef: NgbModalRef = this.modalService.open(contents, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    console.log(data,'data');
    
    if (data) {
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.tableName = data.HEADER_TABLE;
      this.PERMISSIONS = data.PERMISSION;
    } else {
      this.menuTitle = this.CommonService.getModuleName()
      this.tableName = this.CommonService.getqueryParamTable()
    }
    this.masterGridComponent?.getMasterGridData(data)
  }

}
