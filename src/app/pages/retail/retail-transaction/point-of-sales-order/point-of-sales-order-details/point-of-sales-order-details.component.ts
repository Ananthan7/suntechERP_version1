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
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "Location",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  soldItemsDetailsrForm: FormGroup = this.formBuilder.group({
    loaction: [""],
    stockCode: [""],
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
    this.soldItemsDetailsrForm.controls.loaction.setValue(e.STATE_DESCRIPTION);
  
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
