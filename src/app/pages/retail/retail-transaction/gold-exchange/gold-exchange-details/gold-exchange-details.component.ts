import { Component, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";

@Component({
  selector: 'app-gold-exchange-details',
  templateUrl: './gold-exchange-details.component.html',
  styleUrls: ['./gold-exchange-details.component.scss']
})
export class GoldExchangeDetailsComponent implements OnInit {

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
  posPurchaseDirectDetailForm: FormGroup = this.formBuilder.group({
    stockCode: [""],
    stockType: [""],
    fixMetalRate: [""],
    goldType: [""],
    description: [""],
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
    unitCode: [""],
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
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  


}
