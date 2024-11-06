import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-customer-wise-stone-pricing-and-labour-charges',
  templateUrl: './customer-wise-stone-pricing-and-labour-charges.component.html',
  styleUrls: ['./customer-wise-stone-pricing-and-labour-charges.component.scss']
})
export class CustomerWiseStonePricingAndLabourChargesComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();
  stonePricingDetails: any=[];
  labourPricingDetails: any=[];
  accountDetails: any =[];

  stonePricingHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr No" },
    { field: "BRANCH_CODE", caption: "Division" },
    { field: "VOCTYPE", caption: "Type" },
    { field: "DIVISION", caption: "Category" },
    { field: "QTY", caption: "Sub Category" },
    { field: "amount", caption: "Brand" },
    { field: "PROFIT", caption: "Stone Type" },
    { field: "PROFIT", caption: "Shape" },
    { field: "PROFIT", caption: "Sieve Set" },
    { field: "PROFIT", caption: "Sieve From" },
    { field: "PROFIT", caption: "Sieve To" },
    { field: "PROFIT", caption: "Color" },
    { field: "PROFIT", caption: "Clarity" },

 
  ];

  labourPricingHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr No" },
    { field: "BRANCH_CODE", caption: "Division" },
    { field: "PARTYCODE", caption: "Labour Type" },
    { field: "BRANCH_CODE", caption: "Unit" },
    { field: "VOCTYPE", caption: "Method" },
    { field: "DIVISION", caption: "Type" },
    { field: "QTY", caption: "Category" },
    { field: "amount", caption: "Brand" },
    { field: "PROFIT", caption: "Sub Category" },
    { field: "PROFIT", caption: "Shape" },
    { field: "PROFIT", caption: "Size From" },
    { field: "PROFIT", caption: "Size To" },
    { field: "PROFIT", caption: "Sieve" },
    { field: "PROFIT", caption: "Ct Wt From" },
 
  ];

  accountDetailsHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr No" },
    { field: "PARTYCODE", caption: "AC CODE" },
    { field: "BRANCH_CODE", caption: "Account Name" },
    { field: "VOCTYPE", caption: "Calc On" },
 
  ];

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


  customerWiseStonePriceForm: FormGroup = this.formBuilder.group({

    pricecode: [""],
    currency: [""]


  })


  PLACCodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'P/L Ac Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  formSubmit(){}


  deleteRecord() {}


  dobValueSetting(event: any) {
  }

  openItemdetails() {}

  removeItemDetails() {}

}
