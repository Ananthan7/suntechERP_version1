import { Component, OnInit } from "@angular/core";
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
