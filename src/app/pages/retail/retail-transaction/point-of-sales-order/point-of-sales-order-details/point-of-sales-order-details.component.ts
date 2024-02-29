import { Component, OnInit } from "@angular/core";
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-point-of-sales-order-details",
  templateUrl: "./point-of-sales-order-details.component.html",
  styleUrls: ["./point-of-sales-order-details.component.scss"],
})
export class PointOfSalesOrderDetailsComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();
  divisionMS: any = "ID";

  LocationData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: "location",
    SEARCH_HEADING: "Location",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

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
  };

  posOrderDetailsForm: FormGroup = this.formBuilder.group({
    loaction: [""],
    stockCode: [""],
    stockCodeItem:[""],
    stockCodeDesc:[""],
    pieces:[""],
    deliveryDate:[new Date()],
    grossWeight: [""],
    stoneWeight: [""],
    netWeight: [""],
    chargableWeight: [""],
    makingRate:[''],
    metalRate:[''],
    makingAmount:[''],
    metalAmount:[''],
    StoneAmount:[''],
    StoneRate:[''],
    customerSampleStock:[false],
    holdforSalesTill:[false],
    net_amount:['']
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  locationcodeSelected(e:any){
   console.log(e);
    this.posOrderDetailsForm.controls.loaction.setValue(e.STATE_DESCRIPTION);
  
  }

 stockCodeSelected(e:any){
    console.log(e);
    this.posOrderDetailsForm.controls.stockCodeItem.setValue(e.DIVISION_CODE);
    this.posOrderDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.posOrderDetailsForm.controls.stockCodeDesc.setValue(e.DESCRIPTION);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
