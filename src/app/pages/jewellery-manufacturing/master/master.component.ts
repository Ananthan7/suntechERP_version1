import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { JobcardComponent } from './jobcard/jobcard.component';
import { WorkerMasterComponent } from './worker-master/worker-master.component';
import { ActivatedRoute } from '@angular/router';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { ProcessMasterComponent } from './process-master/process-master.component';
import { SequenceMasterComponent } from './sequence-master/sequence-master.component';
import { StonePricingMasterComponent } from './stone-pricing-master/stone-pricing-master.component';
import { LabourChargeMasterComponent } from './labour-charge-master/labour-charge-master.component';
import { MeltingTypeComponent } from './melting-type/melting-type.component';
import { AlloyMasterComponent } from './alloy-master/alloy-master.component';
import { PictureTypeMasterComponent } from './picture-type-master/picture-type-master.component';
import { ApprovalMasterComponent } from './approval-master/approval-master.component';
import { DesignMasterComponent } from './design-master/design-master.component';
import { OtpMasterComponent } from './otp-master/otp-master.component';
import { CustomerPriceMasterComponent } from './customer-price-master/customer-price-master.component';
import { ComponentMasterComponent } from './component-master/component-master.component';
import { StoneCostUpdationComponent } from './stone-cost-updation/stone-cost-updation.component';
import { MfgGridComponent } from '../common-mfg/mfg-grid/mfg-grid.component';
import { AuthCheckerComponent } from 'src/app/shared/common/auth-checker/auth-checker.component';
import { MetalLabourchargeMasterComponent } from './metal-labourcharge-master/metal-labourcharge-master.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterComponent implements OnInit {
  @ViewChild(MfgGridComponent) mfgGridComponent?: MfgGridComponent;
  @ViewChild(AuthCheckerComponent) authCheckerComponent?: AuthCheckerComponent;

  //variables
  menuTitle: any
  componentName: any
  PERMISSIONS: any
  tableName: any
  apiCtrl: any
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  private componentDbList: any = {}
  srNo:any=0;
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
    this.authCheckerComponent?.openAuthModal();
    // this.openModalView(this.dataToEdit)
  }
  deleteBtnClicked(e: any) {
    this.dataToEdit = e.row.data;
    this.dataToEdit.FLAG = 'DELETE'
    // this.openModalView(this.dataToEdit)
    this.authCheckerComponent?.openAuthModal();
  }
  authSubmit(){
    this.openModalView(this.dataToEdit)
  }
  openModalView(data?: any) {
    this.componentDbList = {
      'JobcardComponent': JobcardComponent,
      'WorkerMasterComponent': WorkerMasterComponent,
      'DepartmentMasterComponent': DepartmentMasterComponent,
      'ProcessMasterComponent': ProcessMasterComponent,
      'SequenceMasterComponent': SequenceMasterComponent,
      'StonePricingMasterComponent': StonePricingMasterComponent,
      'LabourChargeMasterComponent': LabourChargeMasterComponent,
      'MeltingTypeComponent': MeltingTypeComponent,
      'AlloyMasterComponent': AlloyMasterComponent,
      'PictureTypeMasterComponent': PictureTypeMasterComponent,
      'ApprovalMasterComponent': ApprovalMasterComponent,
      'DesignMasterComponent': DesignMasterComponent,
      'OtpMasterComponent': OtpMasterComponent,
      'CustomerPriceMasterComponent': CustomerPriceMasterComponent,
      'ComponentMasterComponent': ComponentMasterComponent,
      'StoneCostUpdationComponent': StoneCostUpdationComponent,
      'MetalLabourchargeMasterComponent': MetalLabourchargeMasterComponent,
      'EmployeeMasterComponent' : EmployeeMasterComponent,
      // Add components and update in operationals > menu updation grid form component name
    }
    let contents;
    if (this.componentDbList[this.componentName]) {
      contents = this.componentDbList[this.componentName]
    } else {
      this.snackBar.open('Module Not Created', 'Close', {
        duration: 3000,
      });
    }
    const modalRef: NgbModalRef = this.modalService.open(contents, {
      size: 'xl',
      backdrop: 'static',//'static'
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
    this.mfgGridComponent?.getMasterGridData(data)
  }
  // const endTime = performance.now();
  // const duration = endTime - startTime;
}
