import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

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
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
  

  ngOnInit(): void {
    this.getmetal_divisionvalues();
    if (this.content?.FLAG) {
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
    status: [""],
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
    this.giftVoucherMasterForm.controls.prefix.setValue(e.CODE);
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
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  getmetal_divisionvalues(){
    let API = 'POSTargetMaster/GetDiaDivisonsDropdown';
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        console.log(result);
        this.diamond_drop = result.dynamicData[0]
        console.log(this.diamond_drop)
        const allDivisionCodes = this.diamond_drop.map(option => option.DIVISION_CODE);
        const diaDivisionControl = this.giftVoucherMasterForm?.get('division');
        // if (diaDivisionControl) {
        //   if(this.flag == undefined){
        //     diaDivisionControl.setValue(allDivisionCodes); 
        //   }
        // } 
        }, (err: any) => {

      })
    this.subscriptions.push(Sub);
}


  setPostData(){
    return {
      "MID": 0,
      "BRANCH_CODE": this.commonService.nullToString(this.giftVoucherMasterForm.value.code),
      "GIFT_CODE": this.commonService.nullToString(this.giftVoucherMasterForm.value.giftOn),
      "GIFT_NAME": this.commonService.nullToString(this.giftVoucherMasterForm.value.description),
      "GIFT_TYPE_ON": "string",
      "GIFT_AMOUNT":  this.commonService.emptyToZero(this.giftVoucherMasterForm.value.amount),
      "ACTUAL_AMOUNT": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.actualAmt),
      "MIN_INVOICE_AMOUNT": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.minInvoiceAmt),
      "GIFT_VALID_DAYS": this.commonService.emptyToZero(this.giftVoucherMasterForm.value.validity),
      "SKIP_VALID_DAYS": this.giftVoucherMasterForm.value.skip,
      "DIVISION":  this.commonService.nullToString(this.giftVoucherMasterForm.value.division),
      "PREFIX_CODE":  this.commonService.nullToString(this.giftVoucherMasterForm.value.prefix),
      "ISSUE_TYPE": this.giftVoucherMasterForm.value.issueType,
      "GIFT_CURRENCY_CODE": "stri",
      "STATUS":  this.giftVoucherMasterForm.value.status,
      "SYSTEM_DATE": "2024-11-28T12:22:41.287Z",
      "USERNAME": "string",
      "COST_CODE": this.commonService.nullToString(this.giftVoucherMasterForm.value.costCentre),
      "GIFT_QUNATITY": 0,
      "START_SKU_NO": this.giftVoucherMasterForm.value.active,
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
    let postData = this.setPostData()
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

  }

  deleteRecord() {}


  dobValueSetting(event: any) {
  }

  PLACCodeCodeSelected(e:any){
    console.log(e);
   
  }

}
