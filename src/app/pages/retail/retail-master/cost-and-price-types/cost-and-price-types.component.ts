import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cost-and-price-types',
  templateUrl: './cost-and-price-types.component.html',
  styleUrls: ['./cost-and-price-types.component.scss']
})
export class CostAndPriceTypesComponent implements OnInit {

  itemDetailsData:any

  
  columnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Stock Code" },
    { field: "BRANCH_CODE", caption: "No" },
    { field: "VOCTYPE", caption: "Description" },
    { field: "DIVISION", caption: "Unit" },
    { field: "QTY", caption: "Cost" },
    { field: "amount", caption: "Std Price" },
    { field: "PROFIT", caption: "Min Price" },
    { field: "PROFIT", caption: "Max Price" },
    { field: "amount", caption: "Std Price" },
    { field: "PROFIT", caption: "Min Price" },
    { field: "PROFIT", caption: "Max Price" },
    { field: "PROFIT", caption: "Variance" },
    { field: "PROFIT", caption: "Purity" },
    { field: "PROFIT", caption: "Wastage" },




  ];


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  costAndPriceTypeMainForm: FormGroup = this.formBuilder.group({});


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

  openItemdetails() {}

  removeItemDetails() {}

}
