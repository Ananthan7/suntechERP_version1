import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';
import { RetailKaratRateLogComponent } from './retail-karat-rate-log/retail-karat-rate-log.component';

@Component({
  selector: 'app-general-reports',
  templateUrl: './general-reports.component.html',
  styleUrls: ['./general-reports.component.scss']
})
export class GeneralReportsComponent implements OnInit {
  menuTitle: any;
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  PERMISSIONS: any;
  componentName: any;
  private componentDbList: any = {}
  tableName: any;


  constructor( private CommonService: CommonServiceService, private snackBar: MatSnackBar,    
    private modalService: NgbModal,) { }

  ngOnInit(): void {
     /**USE: to get table data from API */
     this.menuTitle = this.CommonService.getModuleName()
     this.componentName = this.CommonService.getFormComponentName()
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

    openModalView(data?: any) {
      this.componentDbList = {
        // Add components and update in operationals > menu updation grid form component name
        'RetailKaratRateLogComponent': RetailKaratRateLogComponent,

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
      modalRef.componentInstance.content = data || null;
    }
}
