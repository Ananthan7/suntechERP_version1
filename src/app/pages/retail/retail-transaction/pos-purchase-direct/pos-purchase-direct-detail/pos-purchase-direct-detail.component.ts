import { Component, OnInit } from "@angular/core";
import { NgbActiveModal,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";

@Component({
  selector: "app-pos-purchase-direct-detail",
  templateUrl: "./pos-purchase-direct-detail.component.html",
  styleUrls: ["./pos-purchase-direct-detail.component.scss"],
})
export class PosPurchaseDirectDetailComponent implements OnInit {
  branchCode?: String;
  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');
  selected = 'gms';

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  outSideGoldCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Outside Gold',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  SupplierData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Supplier",
    SEARCH_VALUE: "",
    WHERECONDITION: "BRANCH_CODE = '"+ this.userbranch+"' AND AC_OnHold = 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  locCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: "LOCATION",
    SEARCH_HEADING: "Loc Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "@Strbranch='"+ this.userbranch+"',@strUsercode='"+this.userName+"',@stravoidforsales= 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  posPurchaseDirectDetailForm: FormGroup = this.formBuilder.group({
    stockCode: [""],
    stockType: [""],
    fixMetalRate: [true],
    goldType: [""],
    stockCodeDescription: [""],
    supplier: [""],
    locCode: [""],
    pieces: [""],
    grossWeight: [""],
    stoneWeight: [""],
    purity: [""],
    pureWeight: [""],
    mudWeight: [""],
    netWeight: [""],
    chargableWeight: [""],
    purityDiffer: [""],
    stoneDiffer: [""],
    ozWeight: [""],
    unitCode: [this.selected],
    unitValue: [""],
    unitRate: [""],
    unitAmount: [""],
    stoneRate: [""],
    stoneAmount: [""],
    wastagePercent: [""],
    wastageQuantity: [""],
    wastageAmount: [""],
    bagNo: [""],
    metalRate: [""],
    metalAmount: [""],
    netRate: [""],
    netAmount: [""],
    jawaharaSelect: [""],
    reSaleCycleSelect: [""],
    cashExchangeSelect: [""],
    remarks: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,


  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;

  } 

 


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  stockCodeSelected(e:any){
    console.log(e);    
    this.posPurchaseDirectDetailForm.controls.stockCode.setValue(e.DIVISION_CODE);
    this.posPurchaseDirectDetailForm.controls.stockType.setValue(e.STOCK_CODE);
    this.posPurchaseDirectDetailForm.controls.stockCodeDescription.setValue(e.DESCRIPTION);
  }

  outSideGoldSelected(e:any){
    console.log(e);
    this.posPurchaseDirectDetailForm.controls.goldType.setValue(e.CODE);
    
  }

  supplierSelected(e:any){
    console.log(e);
    this.posPurchaseDirectDetailForm.controls.supplier.setValue(e.ACCODE);

  }

  locCodeSelected(e:any){
    console.log(e);
    this.posPurchaseDirectDetailForm.controls.locCode.setValue(e);
  }
}
