import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consumable-master',
  templateUrl: './consumable-master.component.html',
  styleUrls: ['./consumable-master.component.scss']
})
export class ConsumableMasterComponent implements OnInit {
  consumbleForm!: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.consumbleForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: [''],
      costcenter: [''],
      type: [''],
      category: [''],
      subcategory: [''],
      brand: [''],
      color: [''],
      size: [''],
      vendor: [''],
      country: [''],
      hsn: [''],
      pricescheme: [''],
      priceschemeCovRate: [''],
      price1: [''],
      price2: [''],
      price3: [''],
      price4: [''],
      price5: [''],

    });
    this.disableButtons();
    this.consumbleForm.controls['comment'].disable();
    this.consumbleForm.controls['tagDetails'].disable();
  }

  disableButtons() {
    this.consumbleForm.controls['code'].enable();
  }

  enableButtons() {
    this.consumbleForm.controls['code'].enable();
  }

  // consumbleForm: FormGroup = this.formBuilder.group({
  //   code:[''],

  // })

  codeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Code Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 32,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 31,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }




  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Vendor',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  HSNCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HSN',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  priceschemeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Price Scheme Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcategoryCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.subcategory.setValue(e.CODE);
  }

  codeCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.code.setValue(e.PREFIX_CODE);
    this.consumbleForm.controls.description.setValue(e.DESCRIPTION);
  }


  brandCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.brand.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    this.consumbleForm.controls.color.setValue(data.CODE)
  }

  vendorCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.vendor.setValue(e.CODE);
  }

  typeCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.type.setValue(e.CODE);
  }

  categoryCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.category.setValue(e.CODE);
  }

  countryCodeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.country.setValue(e.CODE);
  }

  costCenterSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.costcenter.setValue(e.COST_CODE);
  }

  sizeCenterSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.size.setValue(e.CODE);
  }

  HSNCenterSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.hsn.setValue(e.CODE);
  }

  priceschemeSelected(e: any) {
    console.log(e);
    this.consumbleForm.controls.pricescheme.setValue(e.CURRENCY_CODE);
    this.consumbleForm.controls.priceschemeCovRate.setValue(e.CONV_RATE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



}
