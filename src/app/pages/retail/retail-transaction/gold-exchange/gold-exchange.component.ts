import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gold-exchange',
  templateUrl: './gold-exchange.component.html',
  styleUrls: ['./gold-exchange.component.scss']
})
export class GoldExchangeComponent implements OnInit {

  @Input() content!: any; 

  branchCode?: String;
  yearMonth?: String;

  private subscriptions: Subscription[] = [];

  

  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode:any= '';
  // columnhead:any[] = [
  //   { title: 'Karat', field: 'KARAT_CODE' },
  //   { title: 'Sale Rate', field: 'KARAT_RATE' },
  //   { title: 'Purchase Rate', field: 'POPKARAT_RATE' }];

  columnhead:any[] = ['Karat','Sale Rate','Purchase Rate'];
  columnheadDetails:any[] = ['Stock Code','Pcs','Gr.Wt','Purity','Pure Wt','Mkg.RATE','Mkg.Amount','Metal Amt','St.Amt','Wastage','Total','']
  
  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };



  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Party Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  posPurchaseForm: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocTypeNo:[1],
    vocDate:[new Date()],
    partyCode:[''],
    partyCodeName:[''],
    partyCurrCode:[''],
    partyCurrCodeDesc:[''],
    customer:[''],
    moblie:[''],
    itemCurr:[''],
    itemCurrCode:[''],
    creditDaysCode:[''],
    creditDays:[new Date()],
    salesMan:[''],
    supInvNo:[''],
    date:[new Date()],
    custName:[''],
    email:[''],
    custId:[''],
    narration:[''],
    partyCurrency:[''],
    partyCurrencyCode:[''],
    amount:[''],
    amountDes:[''],
    rndOfAmt:[''],
    rndOfAmtDes:[''],
    rndNetAmt:[''],
    rndNetAmtDes:[''],
    otherAmt:[''],
    otherAmtDes:[''],
    grossAmt:[''],
    grossAmtDes:[''],
    partyCode1:[''],

  });



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private comService: CommonServiceService,
    private suntechApi: SuntechAPIService,
    private toastr: ToastrService,
  ) {
    this.strBranchcode = localStorage.getItem('userbranch');
   }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;



    this.posPurchaseForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
    this.posPurchaseForm.controls.partyCurrCode.setValue(this.comService.compCurrency);
    this.posPurchaseForm.controls.partyCurrCodeDesc.setValue(this.comService.getCurrRate(this.comService.compCurrency));
    this.posPurchaseForm.controls.itemCurr.setValue(this.comService.compCurrency);
    this.posPurchaseForm.controls.itemCurrCode.setValue(this.comService.getCurrRate(this.comService.compCurrency));
    this.getKaratDetails();
  }

  getKaratDetails() {
    this.suntechApi.getDynamicAPI('BranchKaratRate/' + this.strBranchcode).subscribe((result) => {
      if (result.response) {
        this.tableData = result.response;
        console.log(this.tableData);
      }
    });
  }

  partyCodeSelected(e:any){
    console.log(e);
    this.posPurchaseForm.controls.partyCode.setValue(e.ACCODE);
    this.posPurchaseForm.controls.partyCodeName.setValue(e['ACCOUNT HEAD'])
    this.posPurchaseForm.controls.partyCode1.setValue(e['ACCOUNT HEAD'])  
  }

  partyCurrencyCodeSelected(e:any){
    console.log(e);
  }

  customerCodeSelected(e:any){
    console.log(e);
    this.posPurchaseForm.controls.customer.setValue(e.CODE);
    this.posPurchaseForm.controls.custId.setValue(e.CODE);
    this.posPurchaseForm.controls.custName.setValue(e.NAME);
    this.posPurchaseForm.controls.email.setValue(e.EMAIL);
    this.posPurchaseForm.controls.moblie.setValue(e.MOBILE);
  }

  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }
}
