import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ActivatedRoute } from '@angular/router';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { CostCentreMetalComponent } from './cost-centre-metal/cost-centre-metal.component';
@Component({
  selector: 'app-wholesale-master',
  templateUrl: './wholesale-master.component.html',
  styleUrls: ['./wholesale-master.component.scss']
})
export class WholesaleMasterComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;

  //variables
  menuTitle: any
  componentName: any
  PERMISSIONS: any
  tableName: any
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
    // private ChangeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
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
  //  open Jobcard in modal
  openModalView(data?: any) {
    let contents;

    switch (this.componentName) {
      case 'CostcentreMetalchargesComponent':
        contents = CostCentreMetalComponent
        break;
      // case 'WorkerMasterComponent':
      //   contents = WorkerMasterComponent
      //   break;
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
    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        this.tableName = this.CommonService.getqueryParamTable()
        this.getMasterGridData({ HEADER_TABLE: this.tableName })
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data;
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      if (data.MENU_CAPTION_ENG) {
        this.menuTitle = data.MENU_CAPTION_ENG;
      } else {
        this.menuTitle = this.CommonService.getModuleName()
      }
      if (data.ANG_WEB_FORM_NAME) {
        this.componentName = data.ANG_WEB_FORM_NAME;
      } else {
        this.componentName = this.CommonService.getFormComponentName()
      }
      this.PERMISSIONS = data.PERMISSION;
      // this.menuTitle = data.MENU_CAPTION_ENG;
      // this.PERMISSIONS = data.PERMISSION;
      // this.componentName = data.ANG_WEB_FORM_NAME;
    }
    this.masterGridComponent?.getMasterGridData(data)
  }
  // const endTime = performance.now();
  // const duration = endTime - startTime;
}
