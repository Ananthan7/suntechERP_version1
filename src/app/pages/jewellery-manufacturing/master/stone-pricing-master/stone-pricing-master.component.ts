import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stone-pricing-master',
  templateUrl: './stone-pricing-master.component.html',
  styleUrls: ['./stone-pricing-master.component.scss']
})
export class StonePricingMasterComponent implements OnInit {

  @Input() content!: any; 
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sleve_setData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sleve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  shapeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  clarityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Clarity',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizefromData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizetoData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sleveData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 38,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sleve',
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
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  currencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  stonePrizeMasterForm: FormGroup = this.formBuilder.group({
    price_code: ['', [Validators.required]],
    sleve_set: ['', [Validators.required]],
    shape: ['', [Validators.required]],
    sleve_form: ['', [Validators.required]],
    sleve_to: ['', [Validators.required]],
    color: [''],
    clarity: [''],
    size_from: [''],
    size_to: [''],
    currency: [''],
    carat_wt: [''],
    size_from_desc: [''],
    size_to_desc: [''],
    wt_from: [''],
    wt_to: [''],
    issue_rate: [''],
    selling: [''],
    selling_rate: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    if(this.content){
      this.setFormValues()
    }
  }
  setFormValues() {
    if(!this.content) return
    this.stonePrizeMasterForm.controls.price_code.setValue(this.content.price_code)
    this.stonePrizeMasterForm.controls.sleve_set.setValue(this.content.sleve_set)
    this.stonePrizeMasterForm.controls.shape.setValue(this.content.shape)
    this.stonePrizeMasterForm.controls.sleve_form.setValue(this.content.sleve_form)
    this.stonePrizeMasterForm.controls.sleve_to.setValue(this.content.sleve_to)
    this.stonePrizeMasterForm.controls.color.setValue(this.content.color)
    this.stonePrizeMasterForm.controls.clarity.setValue(this.content.clarity)
    this.stonePrizeMasterForm.controls.size_from.setValue(this.content.size_from)
    this.stonePrizeMasterForm.controls.size_to.setValue(this.content.size_to)
    this.stonePrizeMasterForm.controls.currency.setValue(this.content.currency)
    this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.carat_wt)
    this.stonePrizeMasterForm.controls.size_from_desc.setValue(this.content.size_from_desc)
    this.stonePrizeMasterForm.controls.size_to_desc.setValue(this.content.size_to_desc)
    this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.wt_from)
    this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.wt_to)
    this.stonePrizeMasterForm.controls.issue_rate.setValue(this.content.issue_rate)
    this.stonePrizeMasterForm.controls.selling.setValue(this.content.selling)
    this.stonePrizeMasterForm.controls.selling_rate.setValue(this.content.selling_rate)
  }
  formSubmit(){
    if (this.stonePrizeMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'StonePriceMasterDJ/InsertStonePriceMaster'
    let postData = {

      "MID": 0,
      "SRNO": 0,
      "CODE": this.stonePrizeMasterForm.value.price_code || "",
      "DESCRIPTION": "string",
      "SHAPE": this.stonePrizeMasterForm.value.shape || "",
      "COLOR": this.stonePrizeMasterForm.value.color || "",
      "CLARITY": this.stonePrizeMasterForm.value.clarity || "",
      "SIZE_FROM": this.stonePrizeMasterForm.value.size_from || "",
      "SIZE_TO": this.stonePrizeMasterForm.value.size_to || "",
      "CURRENCYCODE": this.stonePrizeMasterForm.value.currency || "",
      "ISSUE_RATE":  this.stonePrizeMasterForm.value.issue_rate || 0,
      "SELLING_RATE":  this.stonePrizeMasterForm.value.selling_rate || 0,
      "LAST_ISSUE_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "SELLING_PER":  this.stonePrizeMasterForm.value.selling || 0,
      "CARAT_WT":  this.stonePrizeMasterForm.value.carat_wt || 0,
      "SIEVE": "string",
      "SIEVE_SET": this.stonePrizeMasterForm.value.sleve_set || "",
      "WEIGHT_FROM":  this.stonePrizeMasterForm.value.wt_from || 0,
      "WEIGHT_TO":  this.stonePrizeMasterForm.value.wt_to || 0,
      "SIEVE_TO":  this.stonePrizeMasterForm.value.sleve_to || "",
      "SIEVEFROM_DESC": "string",
      "SIEVETO_DESC": "string",
      "LAST_UPDATE": new Date().toISOString()
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.stonePrizeMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  priceCodeSelected(data: any) {
    // console.log(data);
    this.stonePrizeMasterForm.controls.price_code.setValue(data.CODE)
  }

  sleve_setDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.sleve_set.setValue(data.CODE)
  }

  shapeDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.shape.setValue(data.CODE)
  }

  slevefromDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.sleve_form.setValue(data.CODE)
  }
  slevetoDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.sleve_to.setValue(data.CODE)
  }
  colorDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.color.setValue(data.CODE)
  }
  clarityDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.clarity.setValue(data.CODE)
  }
  sizefromDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.size_from.setValue(data.CODE)
  }
  sizetoDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.size_to.setValue(data.CODE)
  }
  currencyDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.currency.setValue(data.CURRENCY_CODE)
  }

}