import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JewelleryAltrationDetailsComponent } from '../jewellery-altration/jewellery-altration-details/jewellery-altration-details.component';
import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling-details/jewellery-assembling-details.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-jewellery-assembling',
  templateUrl: './jewellery-assembling.component.html',
  styleUrls: ['./jewellery-assembling.component.scss']
})
export class JewelleryAssemblingComponent implements OnInit {
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;
  divisionMS: any = 'ID';
  column1:any[] = ['SRNO','Stock Code', 'PCS','Design','Type','Category','Sub Category','Brand','Cost Code','Price 1','Price 2','Location'];
  @Input() content!: any; 
  tableData: any[] = [];
  stoneIssueData : any[] =[];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
 
  Attachedfile: any[] = [];
  savedAttachments: any[] = [];


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  lookupKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  openjewelleryassemblingdetails() {
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAssemblingDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  jewelleryassemblingFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
    vocdate:[''],
    enteredBy:[''],
   basecurrency:[''],
   basecurrencyrate:[''],
   currency:[''],
   currencyrate:[''],
   worker:[''],
   workername:[''],
    narration:[''],
  });

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  removedata(){
    this.tableData.pop();
  }
    formSubmit(){
  
      if(this.content && this.content.FLAG == 'EDIT'){
        this.update()
        return
      }
      if (this.jewelleryassemblingFrom.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
      let postData = {
        "MID": 0,
        "VOCTYPE": "string",
        "BRANCH_CODE": "string",
        "VOCNO": "string",
        "VOCDATE": "2023-10-26T05:26:35.911Z",
        "YEARMONTH": "string",
        "DOCTIME": "2023-10-26T05:26:35.911Z",
        "SMAN": "string",
        "REMARKS": "string",
        "CURRENCY_CODE": "string",
        "CURRENCY_RATE": 0,
        "NAVSEQNO": 0,
        "PARTYCODE": "string",
        "MFT_TYPE": 0,
        "METAL_RATE_TYPE": "string",
        "METAL_RATE": 0,
        "CONS_REFMID": 0,
        "AUTOPOSTING": true,
        "POSTDATE": "string",
        "STOCK_CODE": "string",
        "SYSTEM_DATE": "2023-10-26T05:26:35.911Z",
        "FIXED": true,
        "HTUSERNAME": "string",
        "manufactureblk": [
          {
            "MID": 0,
            "BRANCH_CODE": "string",
            "VOCTYPE": "string",
            "VOCNO": 0,
            "VOCDATE": "2023-10-26T05:26:35.911Z",
            "YEARMONTH": "string",
            "ITEM": "string",
            "STOCK_CODE": "string",
            "STOCK_DESCRIPTION": "string",
            "CURRENCY_CODE": "string",
            "CC_RATE": 0,
            "COST_CODE": "string",
            "TYPE_CODE": "string",
            "CATEGORY_CODE": "string",
            "SUBCATEGORY_CODE": "string",
            "BRAND_CODE": "string",
            "COUNTRY_CODE": "string",
            "DESIGN_CODE": "string",
            "SET_REF": "string",
            "PICTURE_NAME": "string",
            "STOCK_FCCOST": 0,
            "STOCK_LCCOST": 0,
            "PRICE1PER": "string",
            "PRICE2PER": "string",
            "PRICE3PER": "string",
            "PRICE4PER": "string",
            "PRICE5PER": "string",
            "PRICE1FC": 0,
            "PRICE1LC": 0,
            "PRICE2FC": 0,
            "PRICE2LC": 0,
            "PRICE3FC": 0,
            "PRICE3LC": 0,
            "PRICE4FC": 0,
            "PRICE4LC": 0,
            "PRICE5FC": 0,
            "PRICE5LC": 0,
            "CHARGE1FC": 0,
            "CHARGE1LC": 0,
            "CHARGE2FC": 0,
            "CHARGE2LC": 0,
            "CHARGE3FC": 0,
            "CHARGE3LC": 0,
            "CHARGE4FC": 0,
            "CHARGE4LC": 0,
            "CHARGE5FC": 0,
            "CHARGE5LC": 0,
            "CHARGE1ACCODE": "string",
            "CHARGE2ACCODE": "string",
            "CHARGE3ACCODE": "string",
            "CHARGE4ACCODE": "string",
            "CHARGE5ACCODE": "string",
            "TAG_LINES": "string",
            "OPENED_ON": "2023-10-26T05:26:35.911Z",
            "OPENED_BY": "string",
            "PCS": 0,
            "COLOR": "string",
            "NAVSEQNO": 0,
            "MARGINACCODE": "string",
            "MARGINPER": 0,
            "MARGINAMTFC": 0,
            "MARGINAMTCC": 0,
            "STARTDATE": "2023-10-26T05:26:35.911Z",
            "FINISHDATE": "2023-10-26T05:26:35.911Z",
            "GOLDSMITH": "string",
            "STONESETTER": "string",
            "HLOC_CODE": "string",
            "REMARKS": "string",
            "SUPPLIER_REF": "string",
            "MWATCH_SERIALNO": "string",
            "STRAP_TYPE": "string",
            "STRAP_COLOR": "string",
            "MODEL_NO": "string",
            "MODEL_YEAR": 0,
            "MODEL_NAME": "string",
            "DIAL_COLOR": "string",
            "BAZEL": "string",
            "MATERIAL": "string",
            "MOVEMENT": "string",
            "STATUS": "string",
            "WEIGHT": "string",
            "STONE_TYPE": "string",
            "SIZE": "string",
            "REFNO": "string",
            "DIAL_SHAPE": "string",
            "SR_NO": "string",
            "MGRADE": "string",
            "MSHAPE": "string",
            "CERT_BY": "string",
            "CERT_NO": "string",
            "CERT_DATE": "2023-10-26T05:26:35.911Z",
            "FLUOR": "string",
            "CLARITY": "string",
            "MANUFCUSTOMERSKU": "string",
            "D2DTRANSFER": "string",
            "LABOUR1": "string",
            "LABOUR2": "string",
            "LABOUR3": "string",
            "LABOUR4": "string",
            "LABOUR5": "string",
            "REFMID": 0,
            "SRNO": 0,
            "VENDOR_REF": "string",
            "GOLDSMITHNAME": "string",
            "STONESETTERNAME": "string",
            "MARGINACCODEDISC": "string",
            "TOTAL_METAL_QTY": 0,
            "TOTAL_STONE_QTY": 0,
            "TOTAL_METAL_FC": 0,
            "TOTAL_STONE_FC": 0,
            "TOTAL_OTHER_FC": 0,
            "TOTAL_METAL_LC": 0,
            "TOTAL_STONE_LC": 0,
            "TOTAL_OTHER_LC": 0,
            "TOTAL_CHARGE_FC": 0,
            "TOTAL_CHARGE_LC": 0,
            "COSTFC": 0,
            "COSTLC": 0,
            "AUTOPOSTING": true,
            "POSTDATE": "string",
            "SUPPLIER_CODE": "string",
            "SYSTEM_DATE": "2023-10-26T05:26:35.911Z",
            "FLAG_EDIT_ALLOW": "string",
            "RANGE_CODE": "string",
            "HTUSERNAME": "string",
            "GENSEQNO": 0,
            "BASE_CURRENCY": "string",
            "BASE_CURR_RATE": 0,
            "BASE_CONV_RATE": 0,
            "STYLE": "string",
            "TIME_CODE": "string",
            "PRINT_COUNT": 0,
            "DT_BRANCH_CODE": "string",
            "DT_VOCTYPE": "string",
            "DT_VOCNO": 0,
            "DT_YEARMONTH": "string",
            "SALESPERSON_CODE": "string",
            "POSGROSSWT": 0,
            "PREFIX_CODE": "string",
            "PURITY": 0,
            "METALGROSSWT": 0,
            "DIAPCS": 0,
            "DIACARAT": 0,
            "STONEPCS": 0,
            "STONECARAT": 0,
            "METAL_WT": 0,
            "FINEGOLD": 0,
            "MASTERFINEGOLD": 0,
            "DIAMOND_RATEFC": 0,
            "DIAMOND_RATELC": 0,
            "DIAMOND_VALUEFC": 0,
            "DIAMOND_VALUELC": 0,
            "COLORSTONE_RATEFC": 0,
            "COLORSTONE_RATELC": 0,
            "COLORSTONE_VALUEFC": 0,
            "COLORSTONE_VALUELC": 0,
            "LABOUR_CHARGEFC": 0,
            "LABOUR_CHARGELC": 0,
            "HMCHARGEFC": 0,
            "HMCHARGELC": 0,
            "CERTCHARGEFC": 0,
            "CERTCHARGELC": 0,
            "WASTAGE": 0,
            "WASTAGEPER": 0,
            "WASTAGEAMOUNTFC": 0,
            "WASTAGEAMOUNTLC": 0,
            "PEARL_PCS": 0,
            "PEARL_WT": 0,
            "PEARL_AMTFC": 0,
            "METALRATELC": 0,
            "METALRATEFC": 0,
            "METALAMOUNTLC": 0,
            "METALAMOUNTFC": 0,
            "PEARL_RATEFC": 0,
            "PEARL_RATELC": 0,
            "FIXED": true,
            "UDF1": "string",
            "UDF2": "string",
            "UDF3": "string",
            "UDF4": "string",
            "UDF5": "string",
            "UDF6": "string",
            "UDF7": "string",
            "UDF8": "string",
            "UDF9": "string",
            "UDF10": "string",
            "UDF11": "string",
            "UDF12": "string",
            "UDF13": "string",
            "UDF14": "string",
            "UDF15": "string",
            "PRINT_COUNT_ACCOPY": 0,
            "PRINT_COUNT_CNTLCOPY": 0,
            "CHARGE6ACCODE": "string",
            "CHARGE7ACCODE": "string",
            "CHARGE8ACCODE": "string",
            "CHARGE9ACCODE": "string",
            "CHARGE10ACCODE": "string",
            "CHARGE6FC": 0,
            "CHARGE6LC": 0,
            "CHARGE7FC": 0,
            "CHARGE7LC": 0,
            "CHARGE8FC": 0,
            "CHARGE8LC": 0,
            "CHARGE9FC": 0,
            "CHARGE9LC": 0,
            "CHARGE10FC": 0,
            "CHARGE10LC": 0
          }
        ],
        "manufactureBlkDetail": [
          {
            "UNIQUEID": 0,
            "SRNO": 0,
            "METALSTONE": "string",
            "STOCK_CODE": "string",
            "DIVCODE": "string",
            "KARAT": "string",
            "CARAT": 0,
            "GROSS_WT": 0,
            "PCS": 0,
            "RATE_TYPE": "string",
            "CURRENCY_CODE": "string",
            "MTST_RATE": 0,
            "MT_GMS_RATE": 0,
            "MAKING_RATE": 0,
            "AMOUNTFC": 0,
            "AMOUNTLC": 0,
            "SUPPLIER": "string",
            "STOCK_DOCDESC": "string",
            "HAMOUNTFC": 0,
            "DLOC_CODE": "string",
            "DNARRATION": "string",
            "MAIN_STOCK_CODE": "string",
            "SLNO": 0,
            "LABACCODE": "string",
            "LABCODE": "string",
            "LABAMOUNTFC": 0,
            "LABAMOUNTCC": 0,
            "LABRATEFC": 0,
            "LABRATECC": 0,
            "LABUNIT": "string",
            "LABDIVISION": "string",
            "DT_BRANCH_CODE": "string",
            "DT_VOCTYPE": "string",
            "DT_VOCNO": 0,
            "DT_YEARMONTH": "string",
            "PURITY": 0,
            "RATECURR": "string",
            "CURRRATE": 0,
            "PRICE1": 0,
            "CONVRATE": 0,
            "BASE_CONV_RATE": 0,
            "ISSUE_NO": 0,
            "ISSUE_MID": 0,
            "MAKING_AMTFC": 0,
            "MAKING_AMTLC": 0,
            "DESIGN_CODE": "string",
            "PURE_WT": 0,
            "STONE_TYPE": "string",
            "SHAPE": "string",
            "COLOR": "string",
            "CLARITY": "string",
            "SIEVE": "string",
            "DSIZE": "string",
            "SIEVE_SET": "string",
            "PRICECODE": "string",
            "METALGROSSWT": 0,
            "DIAPCS": 0,
            "DIACARAT": 0,
            "STONEPCS": 0,
            "STONECARAT": 0,
            "METAL_WT": 0,
            "MASTERFINEGOLD": 0,
            "DIAMOND_RATEFC": 0,
            "DIAMOND_RATELC": 0,
            "DIAMOND_VALUEFC": 0,
            "DIAMOND_VALUELC": 0,
            "COLORSTONE_RATEFC": 0,
            "COLORSTONE_RATELC": 0,
            "COLORSTONE_VALUEFC": 0,
            "COLORSTONE_VALUELC": 0,
            "LABOUR_CHARGEFC": 0,
            "LABOUR_CHARGELC": 0,
            "HMCHARGEFC": 0,
            "HMCHARGELC": 0,
            "CERTCHARGEFC": 0,
            "CERTCHARGELC": 0,
            "WASTAGE": 0,
            "WASTAGEPER": 0,
            "WASTAGEAMOUNTFC": 0,
            "WASTAGEAMOUNTLC": 0,
            "PEARL_PCS": 0,
            "PEARL_WT": 0,
            "PEARL_RATEFC": 0,
            "PEARL_RATELC": 0,
            "PEARL_AMTFC": 0,
            "PEARL_AMTLC": 0,
            "METALRATELC": 0,
            "METALRATEFC": 0,
            "METALAMOUNTLC": 0,
            "METALAMOUNTFC": 0,
            "FIXED": true
          }
        ]
      }
    
      let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
        .subscribe((result) => {
            if(result && result.status == "Success"){
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.jewelleryassemblingFrom.reset()
                  this.tableData = []
                  this.close('reloadMainGrid')
                }
              });
            }else {
              this.commonService.toastErrorByMsgId('MSG3577')
            }
        
        }, err => alert(err))
      this.subscriptions.push(Sub)
    }
  
    setFormValues() {
      if(!this.content) return
      console.log(this.content);
      
      this.jewelleryassemblingFrom.controls.voctype.setValue(this.content.VOCTYPE)
      this.jewelleryassemblingFrom.controls.vocno.setValue(this.content.VOCNO)
      this.jewelleryassemblingFrom.controls.vocdate.setValue(this.content.VOCDATE)
      this.jewelleryassemblingFrom.controls.basecurrency.setValue(this.content.BASE_CURRENCY)
      this.jewelleryassemblingFrom.controls.basecurrencyrate.setValue(this.content.BASE_CURR_RATE)
      this.jewelleryassemblingFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
      this.jewelleryassemblingFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
      this.jewelleryassemblingFrom.controls.worker.setValue(this.content.WORKER_CODE)
      this.jewelleryassemblingFrom.controls.workername.setValue(this.content.WORKER_NAME)
      this.jewelleryassemblingFrom.controls.narration.setValue(this.content.REMARKS)
    }
  
  
    update(){
      if (this.jewelleryassemblingFrom.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/'+ this.jewelleryassemblingFrom.value.branchCode + this.jewelleryassemblingFrom.value.voctype + this.jewelleryassemblingFrom.value.vocno + this.jewelleryassemblingFrom.value.yearMonth
      let postData = {
        "MID": 0,
    "VOCTYPE": this.jewelleryassemblingFrom.value.voctype || "",
    "BRANCH_CODE": this.branchCode,
    "VOCNO": this.jewelleryassemblingFrom.value.vocno || "",
    "VOCDATE": this.jewelleryassemblingFrom.value.vocdate || "",
    "YEARMONTH": this.yearMonth,
    "DOCTIME": "2023-10-19T06:55:16.030Z",
    "CURRENCY_CODE": this.jewelleryassemblingFrom.value.currency || "",
    "CURRENCY_RATE": this.jewelleryassemblingFrom.value.currencyrate || "",
    "TOTAL_PCS": 0,
    "TOTAL_GROSS_WT": 0,
    "TOTAL_AMOUNTFC": 0,
    "TOTAL_AMOUNTLC": 0,
    "SMAN": "string",
    "REMARKS": this.jewelleryassemblingFrom.value.narration || "",
    "NAVSEQNO": 0,
    "BASE_CURRENCY": this.jewelleryassemblingFrom.value.basecurrency || "",
    "BASE_CURR_RATE": this.jewelleryassemblingFrom.value.basecurrencyrate || "",
    "BASE_CONV_RATE": 0,
    "AUTOPOSTING": true,
    "POSTDATE": "string",
    "SYSTEM_DATE": "2023-10-19T06:55:16.030Z",
    "PRINT_COUNT": 0,
    "PRINT_COUNT_ACCOPY": 0,
    "PRINT_COUNT_CNTLCOPY": 0,
    "Details": [
      {
        "SRNO": 0,
        "VOCNO": 0,
        "VOCTYPE": "str",
        "VOCDATE": "2023-10-19T06:55:16.030Z",
        "JOB_NUMBER": "string",
        "JOB_DATE": "2023-10-19T06:55:16.030Z",
        "JOB_SO_NUMBER": 0,
        "UNQ_JOB_ID": "string",
        "JOB_DESCRIPTION": "string",
        "BRANCH_CODE": "string",
        "DESIGN_CODE": "string",
        "DIVCODE": "s",
        "STOCK_CODE": "string",
        "STOCK_DESCRIPTION": "string",
        "SIEVE": "string",
        "SHAPE": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SIZE": "string",
        "JOB_PCS": 0,
        "PCS": 0,
        "GROSS_WT": 0,
        "CURRENCY_CODE": "stri",
        "CURRENCY_RATE": 0,
        "RATEFC": 0,
        "RATELC": 0,
        "AMOUNTFC": 0,
        "AMOUNTLC": 0,
        "PROCESS_CODE": "string",
        "PROCESS_NAME": "string",
        "WORKER_CODE": "string",
        "WORKER_NAME": "string",
        "UNQ_DESIGN_ID": "string",
        "WIP_ACCODE": "string",
        "UNIQUEID": 0,
        "LOCTYPE_CODE": "string",
        "PICTURE_NAME": "string",
        "PART_CODE": "string",
        "REPAIRJOB": 0,
        "BASE_CONV_RATE": 0,
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "str",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "CONSIGNMENT": 0,
        "SIEVE_SET": "string",
        "SUB_STOCK_CODE": "string",
        "D_REMARKS": "string",
        "SIEVE_DESC": "string",
        "EXCLUDE_TRANSFER_WT": true,
        "OTHER_ATTR": "string"
      }
    ] 
      }
    
      let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
        .subscribe((result) => {
            if(result && result.status == "Success"){
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.jewelleryassemblingFrom.reset()
                  this.tableData = []
                  this.close('reloadMainGrid')
                }
              });
            }
            else {
              this.commonService.toastErrorByMsgId('MSG3577')
            }
        }, err => alert(err))
      this.subscriptions.push(Sub)
    }
    
    deleteRecord() {
      if (!this.content.VOCTYPE) {
        Swal.fire({
          title: '',
          text: 'Please Select data to delete!',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        }).then((result: any) => {
          if (result.value) {
          }
        });
        return
      }
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
          let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.jewelleryassemblingFrom.value.branchCode +  this.jewelleryassemblingFrom.value.voctype + this.jewelleryassemblingFrom.value.vocno + this.jewelleryassemblingFrom.value.yearMonth
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
                      this.jewelleryassemblingFrom.reset()
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
                      this.jewelleryassemblingFrom.reset()
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
      });
    }
    close(data?: any) {
      if (data){
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
    ngOnDestroy() {
      if (this.subscriptions.length > 0) {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
        this.subscriptions = []; // Clear the array
      }
    }
}
