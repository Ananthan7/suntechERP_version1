import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { Flag } from 'angular-feather/icons';
import { GiftVoucherDetailMasterComponent } from './gift-voucher-detail-master/gift-voucher-detail-master.component';

@Component({
  selector: 'app-gift-voucher-master',
  templateUrl: './gift-voucher-master.component.html',
  styleUrls: ['./gift-voucher-master.component.scss']
})
export class GiftVoucherMasterComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  diamond_drop:any[]=[];

  @Input() content!: any;
  tableData: any[] = [];
  viewMode: boolean = false;
  editMode:boolean = false;

  @ViewChild('costCentrecodeSearch') costCentrecodeSearch!: MasterSearchComponent;
  @ViewChild('prefixcodeSearch') prefixcodeSearch!: MasterSearchComponent;

  
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,

  ) { }
  

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();

    this.getmetal_divisionvalues();
    if (this.content?.FLAG) {
     
      this.setFormValues();
      console.log(this.content)
      //this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }
  }


  giftVoucherMasterForm: FormGroup = this.formBuilder.group({

    code: [""],
    description: [""],
    giftOn: [""],
    division: [""],
    validity: [""],
    skip: [false],
    costCentre: [""],
    amount: [""],
    baseCurrency: [""],
    actualAmt: [""],
    minInvoiceAmt: [""],
    issueType: [""],
    prefix: [""],
    active: [false],
    dob: [""],

  })


  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix type',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  prefixCodeSelected(e: any) {
    this.giftVoucherMasterForm.controls.prefix.setValue(e.PREFIX_CODE);
  }


  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Center',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterSelected(e:any){
    console.log(e);
    this.giftVoucherMasterForm.controls.costCentre.setValue(e.COST_CODE);
  }

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

  getmetal_divisionvalues() {
    const API = 'POSTargetMaster/GetDiaDivisonsDropdown';
    const Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe(
            (result: any) => {
                console.log(result);
                if (result?.dynamicData?.length) {
                    this.diamond_drop = result.dynamicData[0];
                    const allDivisionCodes = this.diamond_drop.map(option => option.DIVISION_CODE);
                    const diaDivisionControl = this.giftVoucherMasterForm?.get('division');
                    // if (diaDivisionControl) {
                    //   if(this.content?.Flag == undefined){
                    //     diaDivisionControl.setValue(allDivisionCodes); // Pre-select all divisions
                    //   }
                     
                    // }
                }
            },
            (err: any) => {
                console.error('Error fetching division values:', err);
            }
        );
    this.subscriptions.push(Sub);
}

allowNumbersOnly(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
}


setFormValues() {
  console.log(this.content);
  if (!this.content) return
  this.giftVoucherMasterForm.controls.code.setValue(this.content.BRANCH_CODE)
  this.giftVoucherMasterForm.controls.giftOn.setValue(this.content.GIFT_CODE)
  this.giftVoucherMasterForm.controls.description.setValue(this.content.GIFT_NAME)
  this.giftVoucherMasterForm.controls.amount.setValue(this.commonService.transformDecimalVB(
    this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.GIFT_AMOUNT))
  this.giftVoucherMasterForm.controls.actualAmt.setValue(this.commonService.transformDecimalVB(
    this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.ACTUAL_AMOUNT))
  this.giftVoucherMasterForm.controls.minInvoiceAmt.setValue(this.commonService.transformDecimalVB(
    this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.MIN_INVOICE_AMOUNT))
  this.giftVoucherMasterForm.controls.validity.setValue(this.content.GIFT_VALID_DAYS)
  this.giftVoucherMasterForm.controls.skip.setValue(this.content.SKIP_VALID_DAYS === 'Y' ? true : false)
  const divisionValue = this.content.DIVISION; 
  this.giftVoucherMasterForm.controls.division.setValue(divisionValue.split(','));
    this.giftVoucherMasterForm.controls.prefix.setValue(this.content.PREFIX_CODE)
  this.giftVoucherMasterForm.controls.issueType.setValue(this.content.ISSUE_TYPE === 'Y' ? 'D' : 'M')
  this.giftVoucherMasterForm.controls.active.setValue(this.content.STATUS === 'Y' ? true : false)
  this.giftVoucherMasterForm.controls.costCentre.setValue(this.content.COST_CODE)
  this.giftVoucherMasterForm.controls.baseCurrency.setValue(this.commonService.transformDecimalVB(
    this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.START_SKU_NO))
}


  setPostData(){
    return {
      "MID": 0,
      "BRANCH_CODE": this.commonService.nullToString(this.giftVoucherMasterForm.value.code.toUpperCase()),
      "GIFT_CODE": this.commonService.nullToString(this.giftVoucherMasterForm.value.giftOn),
      "GIFT_NAME": this.commonService.nullToString(this.giftVoucherMasterForm.value.description),
      "GIFT_TYPE_ON": "string",
      "GIFT_AMOUNT":  this.commonService.emptyToZero(this.giftVoucherMasterForm.value.amount),
      "ACTUAL_AMOUNT": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.actualAmt),
      "MIN_INVOICE_AMOUNT": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.minInvoiceAmt),
      "GIFT_VALID_DAYS": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.validity),
      "SKIP_VALID_DAYS": this.giftVoucherMasterForm.value.skip ,
      "DIVISION": this.giftVoucherMasterForm.value.division.join(','),
      "PREFIX_CODE":  this.commonService.nullToString(this.giftVoucherMasterForm.value.prefix),
      "ISSUE_TYPE": this.giftVoucherMasterForm.value.issueType === 'D' ? true : false,
      "GIFT_CURRENCY_CODE": "stri",
      "STATUS":  this.giftVoucherMasterForm.value.active,
      "SYSTEM_DATE": "2024-11-28T12:22:41.287Z",
      "USERNAME": "string",
      "COST_CODE": this.commonService.nullToString(this.giftVoucherMasterForm.value.costCentre),
      "GIFT_QUNATITY": 0,
      "START_SKU_NO": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.baseCurrency),
      "Details": [
        {
          "SRNO": 0,
          "UNIQUEID": 0,
          "BRANCH_CODE": "string",
          "DIVISION": "string",
          "GIFT_CODE": "string",
          "GIFT_NAME": "string",
          "GIFT_QUNATITY": 0,
          "GIFT_VOUCHER_NO": "string",
          "STK_DESCRIPTION": "string",
          "GIFT_AMOUNT": 0,
          "ACTUAL_AMOUNT": 0,
          "SYSTEM_DATE": "2024-11-28T12:22:41.287Z",
          "SKU_NO": 0,
          "ISSUED": true
        }
      ]
    }
    
  }


  openaddGiftVoucherDetail() {
    const modalRef: NgbModalRef = this.modalService.open(GiftVoucherDetailMasterComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.editMode = this.editMode;
    modalRef.componentInstance.viewMode = this.viewMode;
  }
  


  formSubmit(){
    
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.diamondprefixForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'GiftVoucherMaster'
    let postData = this.setPostData();
    console.log(postData);
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
       
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.giftVoucherMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update(){
    if (this.giftVoucherMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'GiftVoucherMaster/' + this.content.BRANCH_CODE +'/'+ this.content.GIFT_CODE;
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
                this.giftVoucherMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)

  }

  deleteRecord() {
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
        let API = 'GiftVoucherMaster/' + this.content.BRANCH_CODE +'/'+ this.content.GIFT_CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.giftVoucherMasterForm.reset()
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
                  this.giftVoucherMasterForm.reset()
                  this.tableData = []
                  this.close()
                }
              });
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else{
        this.close('reloadMainGrid')
      }
    });
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

        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.giftVoucherMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
  }


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
      case 'costCentre':
        this.costCentrecodeSearch.showOverlayPanel(event);
        break;
        case 'prefix':
          this.prefixcodeSearch.showOverlayPanel(event);
          break;

      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'costCentre':
        this.costCentrecodeSearch.showOverlayPanel(event);
        break;
        case 'prefix':
          this.prefixcodeSearch.showOverlayPanel(event);
          break;


      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

}
