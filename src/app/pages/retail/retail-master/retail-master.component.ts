import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
@Component({
  selector: 'app-retail-master',
  templateUrl: './retail-master.component.html',
  styleUrls: ['./retail-master.component.scss']
})
export class RetailMasterComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  //variables
  menuTitle: string = '';
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  tableName: any;
  PERMISSIONS: any

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.getMasterGridData()
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
    this.masterGridComponent?.getMasterGridData(data)
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
    let contents: any;
    switch (this.menuTitle) {
      case 'Sale':
        // contents = AddPosComponent
        break;
      case 'POINT OF SALE CURRENCY RECEIPT':
        // contents = PosCurrencyReceiptComponent
        break;
      //continue adding components using case then break
      default:
        this.snackBar.open('No Response Found!', 'Close', {
          duration: 3000,
        });
        return;
    }
    const modalRef: NgbModalRef = this.modalService.open(contents, {
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
