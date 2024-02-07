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
  selector: 'app-jewellery-assembling-stones-details',
  templateUrl: './jewellery-assembling-stones-details.component.html',
  styleUrls: ['./jewellery-assembling-stones-details.component.scss']
})
export class JewelleryAssemblingStonesDetailsComponent implements OnInit {

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

  JewelleryAssemblingStoneDetailsForm: FormGroup = this.formBuilder.group({
    stockCode: [""],
    stockCodedes: [""],
    description : [""],
    shape: [""],
    sieveSet : [""],
    clarity: [""],
    sieve: [""],
    Pieces: [""],
    unitRate : [""],
    quantity : [""],
    amount  : [""],
    stoneType  : [""],
    color  : [""],
    labAcCode : [""],
    labourCode  : [""],
    currencyDes: [""],
    issueNo  : [""],
    location  : [""],
    size  : [""],
    currency : [""],
    coat  : [""],
   
    
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
    this.JewelleryAssemblingStoneDetailsForm.controls.stockCode.setValue(e.DIVISION_CODE);
    this.JewelleryAssemblingStoneDetailsForm.controls.stockCodedes.setValue(e.STOCK_CODE); 
    this.JewelleryAssemblingStoneDetailsForm.controls.description.setValue(e.DESCRIPTION); 
  }


  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 33,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stock Code Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,    
    LOAD_ONCLICK: true,
  }
  shapeCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingStoneDetailsForm.controls.shape.setValue(e.CODE);
    
  }

  sieveSetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Rate type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sieveSetCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingStoneDetailsForm.controls.sieveSet.setValue(e.CODE);
  }

  clarityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 37,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Supplier type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CLARITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  clarityCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingStoneDetailsForm.controls.clarity.setValue(e.CODE);
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
    this.JewelleryAssemblingStoneDetailsForm.controls.location.setValue(e.Location);
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sieveCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingStoneDetailsForm.controls.sieve.setValue(e.CODE);
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeCodeSelected(e:any){
    console.log(e);
    this.JewelleryAssemblingStoneDetailsForm.controls.size.setValue(e.CODE);
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
