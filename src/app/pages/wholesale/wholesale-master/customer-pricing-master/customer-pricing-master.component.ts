import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-pricing-master',
  templateUrl: './customer-pricing-master.component.html',
  styleUrls: ['./customer-pricing-master.component.scss']
})
export class CustomerPricingMasterComponent implements OnInit {

  divisionMS: any = 'ID';
  columnheader:any[] = ['SrNo','Group 1','Group 2', 'Group 3','Group 4','Group 5','Group 6','Apply On U','Mkg On %','Std Mkg','Mkg Rate','Mkg Rate','Variance'];
  columnheader1:any[] = ['Branch','Making','Wastage', 'Apply',];
  columnheaderweightRange:any[] = ['SrNo','Division','Apply on Unit', 'From Weight','To Weight','Making Rate'];
  columnheaderTransaction : any[] = ['SrNo','Karat','Std Purity','Sales Purity','Purchase Purity'];

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

  customerpricemasterForm: FormGroup = this.formBuilder.group({
    division:[],
    approvalby:[],
    enteredBy:[],
    price:[],
    currency:[],
    custsupp:[]
  })

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  userDataSelected(value: any) {
    console.log(value);
       this.customerpricemasterForm.controls.enteredBy.setValue(value.UsersName);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e:any){
    console.log(e); 
    this.customerpricemasterForm.controls.division.setValue(e.DIVISION);
  }

  custsuppCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Cust/Supp Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  custsuppCodeSelected(e:any){
    console.log(e); 
    this.customerpricemasterForm.controls.custsupp.setValue(e.ACCODE);
  }

  approvalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Approval Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ApprovalCodeSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.approvalby.setValue(e.UsersName);
  }

  
  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 87,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  priceCodeSelected(e:any){
    console.log(e);
    this.customerpricemasterForm.controls.price.setValue(e.PRICE_CODE);
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  currencyCodeSelected(e:any){
    console.log(e); 
    this.customerpricemasterForm.controls.currency.setValue(e.CURRENCY_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
