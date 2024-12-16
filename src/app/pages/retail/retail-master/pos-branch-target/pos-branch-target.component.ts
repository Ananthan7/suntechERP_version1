import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry } from 'rxjs/operators';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-pos-branch-target',
  templateUrl: './pos-branch-target.component.html',
  styleUrls: ['./pos-branch-target.component.scss']
})
export class PosBranchTargetComponent implements OnInit {
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlaykaratSearch') overlaykaratSearch!: MasterSearchComponent;
  @ViewChild('overlaystockCodeSearch') overlaystockCodeSearch!: MasterSearchComponent;



  @Input() content!: any;

  tableData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];
  metal: any;
  description: any;
  code: any;
  alloy: any;
  flag: any;
  slNo = 0;
  selectedIndexes: any = [];
  viewMode: boolean = false;
  viewModeField: boolean = true;
  SearchDisable: boolean = false;
  editCode: boolean = false;
  allStockCodes: any;
  filteredStockCodes: any[] | undefined;
  codeEnable: boolean = true;
  rowData: any;
  editMode: boolean = false;
  karatval: any;
  purityval: any;
  isDisableSaveBtn: boolean = false;
  columnheads: any[] = ['Sr', 'Division', 'Default Alloy', 'Description', 'Alloy %'];
  currentDate: any = this.commonService.currentDate;

  
  karatcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'FIN YEAR',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 
  posbranchtarget: FormGroup = this.formBuilder.group({
    code: [''],
    dateFrom: [''],
    dateTo: [''],
    DailyTarget: [''],
    finYear: [''],
    diamond: [''],
    goldMaking: [''],
    goldQty: [''],
    diaDivision: [''],
    metalDivision: [''],
    salesAmount: [''],
    profit: [''],
    quantity: [''],
    makingCharge: [''],


  });
  @ViewChild('codeInput')
  codeInput!: ElementRef;
  @ViewChild("codeField") codeField!: ElementRef;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    
    this.flag = this.content
    ? this.content.FLAG
    : (this.content = { FLAG: "ADD" }).FLAG;

    this.viewModeField = true;
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.editCode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.editCode = true;
        this.viewMode = false;
        this.codeEnable = false;
        this.editMode = true;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.delete()
      }
    }
  }
  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }
  
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.posbranchtarget.controls.dateFrom.setValue(new Date(date))
    }
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.posbranchtarget.controls.dateTo.setValue(new Date(date))
    }
  }


  
  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.posbranchtarget.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          //this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    }

  setPostData() {
    return {
      "MID": 0,
      "TARGET_CODE": this.commonService.nullToString(this.posbranchtarget.value.code),
      "TARGET_DESCRIPTION": "string",
      "FYEARCODE": this.commonService.nullToString(this.posbranchtarget.value.finYear),
      "FROM_DATE": this.posbranchtarget.value.dateFrom,
      "TO_DATE": this.posbranchtarget.value.dateTo,
      "METAL_DIAMOND": true,
      "SALES_PROFIT": true,
      "GROUP1_TYPE": "string",
      "GROUP2_TYPE": "string",
      "GROUP3_TYPE": "string",
      "DIA_AMOUNT": this.commonService.emptyToZero(this.posbranchtarget.value.diamond),
      "GOLD_AMOUNT":  this.commonService.emptyToZero(this.posbranchtarget.value.goldMaking),
      "GOLD_QTY":  this.commonService.emptyToZero(this.posbranchtarget.value.goldQty),
      "SYSTEM_DATE": "2024-11-15T09:45:19.213Z",
      "DIA_DIVISIONS":  this.commonService.nullToString(this.posbranchtarget.value.diaDivision),
      "MTL_DIVISIONS": this.commonService.nullToString(this.posbranchtarget.value.metalDivision),
      "SALES_AMOUNT":this.commonService.nullToString(this.posbranchtarget.value.salesAmount),
      "METAL_MKGCHARGE": this.commonService.nullToString(this.posbranchtarget.value.profit),
      "METAL_QTY": this.commonService.nullToString(this.posbranchtarget.value.quantity),
      "PROFIT": this.commonService.nullToString(this.posbranchtarget.value.makingCharge),
      "DIA_TARGET_TYPE": true,
      "MTL_TARGET_TYPE": true,
      "Details": [
        {
          "TARGET_CODE": this.commonService.nullToString(this.posbranchtarget.value.code),
          "BRANCH_CODE": "string",
          "SRNO": 0,
          "TARGET_GROUP1": "string",
          "TARGET_GROUP2": "string",
          "TARGET_GROUP3": "string",
          "MONTH": "string",
          "FYEARCODE":this.commonService.nullToString(this.posbranchtarget.value.finYear),
          "TARGET_AMOUNT": 0,
          "TARGET_WEIGHT": 0,
          "DT_GOLDAMOUNT": 0,
          "DT_GOLDQTY": 0,
          "UNIQUEID": 0,
          "AMOUNT": 0,
          "MTL_TARGET": 0
        }
      ]
    }
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }
 

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'POSTargetMaster/InsertPosTargetMaster';
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        console.log('result', result)
        if (result.response) {
          if (result.status == 'Success') {
            Swal.fire({
              title: 'Saved Successfully',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok',
            }).then((result: any) => {
              if (result.value) {
                this.posbranchtarget.reset();
                this.tableData = [];
                this.close('reloadMainGrid');
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);
  }



  karatcodeSelected(e: any) {
    this.posbranchtarget.controls.finYear.setValue(e.FYEARCODE);
  }


  setFormValues() {
    if (!this.content) return
    let API = 'POSTargetMaster/GetPosTargetMasterDetail/'  + this.content.TARGET_CODE;

    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        let data = result.response;
        if (!data) {
          this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          return
        }
        
         this.posbranchtarget.controls.code.setValue(data.TARGET_CODE?.toUpperCase());
         this.posbranchtarget.controls.finYear.setValue(data.FYEARCODE?.toUpperCase());
         this.posbranchtarget.controls.dateFrom.setValue(data.FROM_DATE);
         this.posbranchtarget.controls.dateTo.setValue(data.TO_DATE);
         this.posbranchtarget.controls.diamond.setValue(data.DIA_AMOUNT);
         this.posbranchtarget.controls.goldMaking.setValue(data.GOLD_AMOUNT);
         this.posbranchtarget.controls.goldQty.setValue(data.GOLD_QTY);
         this.posbranchtarget.controls.diaDivision.setValue(data.DIA_DIVISIONS);
         this.posbranchtarget.controls.metalDivision.setValue(data.MTL_DIVISIONS);
         this.posbranchtarget.controls.salesAmount.setValue(data.SALES_AMOUNT);
         this.posbranchtarget.controls.profit.setValue(data.METAL_MKGCHARGE);
         this.posbranchtarget.controls.quantity.setValue(data.METAL_QTY);
         this.posbranchtarget.controls.makingCharge.setValue(data.PROFIT);
      })
    this.subscriptions.push(Sub)
  }
  formatGridData() {
    this.tableData.forEach((item: any) => {
      item.ALLOY_PER = this.commonService.decimalQuantityFormat(item.ALLOY_PER, 'AMOUNT')
    })
  }

  update() {
    
    let API = 'POSTargetMaster/UpdatePosTargetMaster/' + this.posbranchtarget.value.code;
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.posbranchtarget.reset();
                this.tableData = [];
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  delete() {
    if (this.content && this.content.FLAG == 'VIEW') return
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'POSTargetMaster/DeletePosTargetMaster/' + this.posbranchtarget.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.posbranchtarget.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.posbranchtarget.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else{
        this.close('reloadMainGrid');
      }
    });
  }

  allowNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
}


  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }


  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.overlaykaratSearch.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlaystockCodeSearch.showOverlayPanel(event);
        break;
      default:
    }
  }


  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'color') {
  //     this.overlaycolorSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'karat') {
  //     this.overlaykaratSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'stockCode') {
  //     this.overlaystockCodeSearch.showOverlayPanel(event)
  //   }
  // }
}
