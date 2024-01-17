import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-priceschemes-master',
  templateUrl: './priceschemes-master.component.html',
  styleUrls: ['./priceschemes-master.component.scss']
})
export class PriceschemesMasterComponent implements OnInit {
  priceSchemaMasterForm!: FormGroup;
  @Input() content!: any;
  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  priceOneCodeSelected(e: any) {
    try {
      console.log(e);
      this.priceSchemaMasterForm.controls.price1.setValue(e.PRICE_CODE);
    } catch (error) {
      console.error('Error in priceOneCodeSelected:', error);
    }
  }

  close(data?: any) {
    try {
      this.activeModal.close(data);
    } catch (error) {
      console.error('Error in close:', error);
    }
  }

  formSubmit() {
    try {

    } catch (error) {
      console.error('Error in formSubmit:', error);

    }
  }

  update() {
    try {

    } catch (error) {
      console.error('Error in update:', error);

    }
  }

  deleteRecord() {
    try {

    } catch (error) {
      console.error('Error in deleteRecord:', error);

    }
  }

  private initializeForm() {
    try {
      this.priceSchemaMasterForm = this.formBuilder.group({
        priceCode: ['', [Validators.required]],
        priceCodeList: ['', [Validators.required]],
        price1: ['', [Validators.required]],
        price2: ['', [Validators.required]],
        price3: ['', [Validators.required]],
        price4: [''],
        price5: [''],
      })
    } catch (error) {
      console.error('Error in initializeForm:', error);
    }
  }

}
