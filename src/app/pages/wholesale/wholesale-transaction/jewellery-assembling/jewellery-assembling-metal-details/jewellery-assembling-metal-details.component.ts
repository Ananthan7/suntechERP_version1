import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-jewellery-assembling-metal-details',
  templateUrl: './jewellery-assembling-metal-details.component.html',
  styleUrls: ['./jewellery-assembling-metal-details.component.scss']
})
export class JewelleryAssemblingMetalDetailsComponent implements OnInit {

  @Input() content!: any; 
  tableData: any[] = [];

  columnhead: any[] = ['Srno','Div.','Stock Code','Karat','Stock Type','Pcs','Wt/Ct','Color','Clarity','Shape','Sieve Std.','Description','Size','Process Transaction','Remarks',]
  columnhead2: any[] = ['',]
  selectedTabIndex = 0;
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

  JewelleryAssemblingMetalDetailsForm: FormGroup = this.formBuilder.group({
    stockCode: [""],
    stockCodedes: [""],
    description : [""],
    karat: [""],
    rateType : [""],
    purity: [""],
    metalRate: [""],
    pcs: [""],
    mlRate : [""],
    grossWt : [""],
    mkgRateLc  : [""],
    pureWt  : [""],
    supplier  : [""],
    issueNo : [""],
    location  : [""],
    mkgAmountLC  : [""],
    mkgAmountFC  : [""],
    amountLC  : [""],
    amountFC : [""],
    
  });
  
 

  StockcodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,    
    LOAD_ONCLICK: true,
  }
  StockcodeCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingMetalDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.JewelleryAssemblingMetalDetailsForm.controls.stockCodedes.setValue(e.DESCRIPTION); 
  }

  rateTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'Rate type',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingMetalDetailsForm.controls.rateType.setValue(e.RATE_TYPE);
  }

  supplierCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Supplier type',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  supplierCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingMetalDetailsForm.controls.supplier.setValue(e.ACCODE);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Location<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingMetalDetailsForm.controls.location.setValue(e.Location);
  }
  


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  addTableData(){
    let length = this.tableData.length;

      let srno = length + 1;
      let data = {
        "SRNO": srno,
        "DIVCODE": "",
        "STOCK_CODE": "",
        "CARAT": "",
        "STOCK_FCCOST": "",
        "PCS": "",
        "GROSS_WT": "",
        "COLOR": "",
        "CLARITY": "",
        "SHAPE": "",
        "SIEVE": "",
        "DESCRIPTION": "",
        "DSIZE": "",
        "PROCESS_TYPE": "",
        "D_REMARKS": "",
      };
      this.tableData.push(data);
      this.tableData.filter((data, i) => data.SRNO = i + 1)
  }
  

  deleteTableData(){


  }

  formSubmit(){}

}
