import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { RetailGridComponent } from '../common-retail/retail-grid/retail-grid.component';
import { PosCreditcardPostingComponent } from './pos-creditcard-posting/pos-creditcard-posting.component';
@Component({
  selector: 'app-retail-utilities',
  templateUrl: './retail-utilities.component.html',
  styleUrls: ['./retail-utilities.component.scss']
})
export class RetailUtilitiesComponent implements OnInit {
  @ViewChild(RetailGridComponent) retailGridComponent?: RetailGridComponent;

  //variables
  menuTitle: string = '';
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  tableName: any;
  PERMISSIONS: any
  componentName: any;
  private componentDbList: any = {}
  componentSelected: any;

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.getMasterGridData()
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  ngOnInit(): void {
    if (localStorage.getItem('AddNewFlag') && localStorage.getItem('AddNewFlag') == '1') {
      this.openModalView('Sale')
      localStorage.removeItem('AddNewFlag')
    }
  }

 
  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.PERMISSIONS = data.PERMISSION;
    } else {
      this.menuTitle = this.CommonService.getModuleName()
    }
    this.retailGridComponent?.getMasterGridData(data)
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
    if (data && data == 'Sale') {
      this.menuTitle = data
    }
    this.componentDbList = {
      'PosCreditcardPostingComponent': PosCreditcardPostingComponent,
      // 'SchemeMasterComponent': SchemeMasterComponent,
  
      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }

    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });
    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        this.getMasterGridData({HEADER_TABLE: this.CommonService.getqueryParamTable()})
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data;
  }

}