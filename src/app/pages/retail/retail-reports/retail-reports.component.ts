import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
@Component({
  selector: 'app-retail-reports',
  templateUrl: './retail-reports.component.html',
  styleUrls: ['./retail-reports.component.scss']
})
export class RetailReportsComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  //variables
  menuTitle: any;
  componentName: any;
  PERMISSIONS: any;
  componentSelected: any;
  private componentDbList: any = {}

  constructor(
    private CommonService: CommonServiceService,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  ngOnInit(): void {
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
    this.componentDbList = {
      // 'DiamondSalesorderComponent': DiamondSalesorderComponent,
      // 'DiamondQuotationComponent': DiamondQuotationComponent,
  
      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }

    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((result:any) => {
      if (result === 'reloadMainGrid') {
        let details = { 
          HEADER_TABLE: this.CommonService.getqueryParamTable(),
          MENU_CAPTION_ENG: this.CommonService.getModuleName()
        }
        this.getMasterGridData(details)
      }
    }, (reason:any) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data || {};
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      if(data.MENU_CAPTION_ENG){
        this.menuTitle = data.MENU_CAPTION_ENG;
      }else{
        this.menuTitle = this.CommonService.getModuleName()
      }
      if(data.ANG_WEB_FORM_NAME){
        this.componentName = data.ANG_WEB_FORM_NAME;
      }else{
        this.componentName = this.CommonService.getFormComponentName()
      }
      this.PERMISSIONS = data.PERMISSION;
    }
    this.masterGridComponent?.getMasterGridData(data)
  }

}