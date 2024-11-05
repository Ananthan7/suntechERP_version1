import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ActivatedRoute } from '@angular/router';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { JewelleryMasterComponent } from './jewellery-master/jewellery-master.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { PricelistMasterComponent } from './pricelist-master/pricelist-master.component';
import { AccountContactComponent } from './account-contact/account-contact.component';
import { WholesaleSalesmanTargetComponent } from './wholesale-salesman-target/wholesale-salesman-target.component';
@Component({
  selector: 'app-general-master',
  templateUrl: './general-master.component.html',
  styleUrls: ['./general-master.component.scss']
})
export class GeneralMasterComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;

  //variables
  menuTitle: any;
  componentName: any;
  PERMISSIONS: any;
  tableName: any;
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  private componentDbList: any = {}
  dataToEdit: any;

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
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'VIEW'
    this.openModalView(this.dataToEdit)
  }
  editRowDetails(e: any) {
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'EDIT'
    this.openModalView(this.dataToEdit)
  }
  deleteBtnClicked(e: any) {
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'DELETE'
    this.openModalView(this.dataToEdit)
    // this.authCheckerComponent?.openAuthModal();
  }
  //  open Jobcard in modal
  openModalView(data?: any) {
    this.componentDbList = {
      'ChartOfAccountsComponent': ChartOfAccountsComponent,
      'JewelleryMasterComponent': JewelleryMasterComponent,
      'LocationMasterComponent': LocationMasterComponent,
      'PricelistMasterComponent': PricelistMasterComponent,
      'AccountContactComponent':AccountContactComponent,
      // 'WholesaleSalesmanTargetComponent':WholesaleSalesmanTargetComponent
      // Add components and update in operationals > menu updation grid form component name
    }
    let contents;
    if (this.componentDbList[this.componentName]) {
      contents = this.componentDbList[this.componentName]
      // add new components in componentDbList then update in database
    } else {
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
