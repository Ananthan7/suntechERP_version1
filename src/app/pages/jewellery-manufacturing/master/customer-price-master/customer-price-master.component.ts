import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-customer-price-master',
  templateUrl: './customer-price-master.component.html',
  styleUrls: ['./customer-price-master.component.scss']
})
export class CustomerPriceMasterComponent implements OnInit {

  divisionMS: any = 'ID';
  columnheader:any[] = ['PRICE_CODE','SIEVE','SIEVE_TO','SIEVE_SET','SHAPE','COLOR','CLARITY','SIZE_FROM','SIZE_TO','CARAT_WT','CURRANCY','ISSUE_RATE','SELLING_RATE','SELLING_PER','WEIGHT_FROM','WEIGHT_TO','CUSTOMER','PRICE_TYPE','CUSTOMER_CODE','DT_VALID_FROM'];
  columnheader1:any[] = ['LABOUR_CODE','DIVISION_CODE','SHAPE','DIVISION','METHOD','UNITCODE','CURRENCY_CODE','CRACCODE','COST_RATE','SELLING_RATE','CARATWT_FROM','CARATWT_TO','CUSTOMER_CODE','REFMID','DT_VALID_FROM'];
  columnheader2:any[] = ['DESIGN_CODE','LABOUR_CODE','LABTYPE','METHOD','DIVISION','CURRENCY_CODE','UNITCODE','COST_RATE','SELLING_PER','CRACCODE','DIVISION_CODE','SELLING_RATE','CUSTOMER_CODE','REFMID','DT_VALID_FROM'];
  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  currentDate: any = this.commonService.currentDate;
  branchCode?: String;
  yearMonth?: String;
  value: any;
  rateInput: any; 
  text="Deduct";

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'CUSTOMER_CODE',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CUSTOMER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  



  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {

    console.log(this.content.FLAG);
    if (this.content.FLAG == 'VIEW') {
      this.viewFormValues();
    }
    else (this.content.FLAG == 'EDIT')
    {
      this.setFormValues();
    }
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    
  }



  customerpricemasterForm: FormGroup = this.formBuilder.group({
    customercode :['',[Validators.required]],
    desc :[''],
    pricecode : ['',[Validators.required]],
    labourtype:['',[Validators.required]],
    addonrate : [''],
    margin:[''],
    markup:[''],
    metal_loss:[''],
    date:[new Date(),''],
    text:[''],
    changePrice:[''],
    
   });



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  change(event: any) {
    console.log(event);
    this.text = event.target.checked ? "Add" : "Deduct";
  }


  customerCodeScpSelected(e:any){
    console.log(e); 
    this.customerpricemasterForm.controls.customercode.setValue(e.CUSTOMER_CODE);
    this.customerpricemasterForm.controls.desc.setValue(e.DESCRIPTION);
  }

  setFormValues(){
    
    if (!this.content) return
    this.customerpricemasterForm.controls.customercode.setValue(this.content.CUSTOMER_CODE)
    this.customerpricemasterForm.controls.desc.setValue(this.content.DESCRIPTION)
    this.customerpricemasterForm.controls.metal_loss.setValue(this.content.GOLD_LOSS_PER)
    this.customerpricemasterForm.controls.pricecode.setValue(this.content.PRICECODE)
    this.customerpricemasterForm.controls.margin.setValue(this.content.MARGIN_PER)
    this.customerpricemasterForm.controls.labourtype.setValue(this.content.LAB_TYPE)
    this.customerpricemasterForm.controls.markup.setValue(this.content.MARKUP_PER)
    this.customerpricemasterForm.controls.text.setValue(this.content.CUSTOMER_NAME)
    this.customerpricemasterForm.controls.date.setValue(this.content.VALID_FROM)
    this.customerpricemasterForm.controls.addonrate.setValue(this.content.ADD_ON_RATE)
  }

  viewFormValues() {
  
    if (!this.content) return
    this.customerpricemasterForm.controls.customercode.setValue(this.content.CUSTOMER_CODE)
    this.customerpricemasterForm.controls.desc.setValue(this.content.DESCRIPTION)
    this.customerpricemasterForm.controls.metal_loss.setValue(this.content.GOLD_LOSS_PER)
    this.customerpricemasterForm.controls.pricecode.setValue(this.content.PRICECODE)
    this.customerpricemasterForm.controls.margin.setValue(this.content.MARGIN_PER)
    this.customerpricemasterForm.controls.labourtype.setValue(this.content.LAB_TYPE)
    this.customerpricemasterForm.controls.markup.setValue(this.content.MARKUP_PER)
    this.customerpricemasterForm.controls.text.setValue(this.content.CUSTOMER_NAME)
    this.customerpricemasterForm.controls.date.setValue(this.content.VALID_FROM)
    this.customerpricemasterForm.controls.addonrate.setValue(this.content.ADD_ON_RATE)

  }

  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    // if (this.customerpricemasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
  
    let API = 'CustomerPriceMaster/InsertCustomerPriceMaster'
    let postData = {
      "MID": 0,
      "CUSTOMER_CODE": this.customerpricemasterForm.value.customercode || "",
      "DESCRIPTION":  this.customerpricemasterForm.value.desc || "",
      "GOLD_LOSS_PER":  this.customerpricemasterForm.value.metal_loss || 0,
      "UPDATE_ON": "2023-11-28T05:47:14.177Z",
      "PRICECODE": this.customerpricemasterForm.value.pricecode || "",
      "MARGIN_PER": this.customerpricemasterForm.value.margin || 0,
      "LAB_TYPE": this.customerpricemasterForm.value.labourtype || "",
      "MARKUP_PER":  this.customerpricemasterForm.value.markup || 0,
      "CUSTOMER_NAME":  this.customerpricemasterForm.value.text,
      "PRINT_COUNT": 0,
      "VALID_FROM": this.customerpricemasterForm.value.date,
      "ADD_ON_RATE":this.customerpricemasterForm.value.addonrate || 0,
      "CURRENCY_CODE": "str",
      "CURRENCY_RATE": 0,
      "MAIN_VOCTYPE": "string",
      "CUSTOMER_PRICE_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "",
          "PRICE_CODE": "",
          "DESCRIPTION": "",
          "SHAPE": "",
          "COLOR": "",
          "CLARITY": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "CURRENCYCODE": "",
          "ISSUE_RATE": 0,
          "SELLING_RATE": 0,
          "UPDATE_ON": "2023-11-28T05:47:14.178Z",
          "CARAT_WT": 0,
          "SIEVE": "",
          "SELLING_PER": 0,
          "UNITCODE": "",
          "LABTYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "CRACCODE": "",
          "COST_RATE": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "ACCESSORIES": 0,
          "PRICE_TYPE": 0,
          "SIEVE_SET": "",
          "WEIGHT_FROM": 0,
          "WEIGHT_TO": 0,
          "SIEVE_TO": "",
          "CUSTOMER_NAME": "",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "",
          "SRNO": 0
        }
      ],
      "CUSTOMER_LABCHRG_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "",
          "LABOUR_CODE": "",
          "LABTYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "CURRENCYCODE": "",
          "UNITCODE": "",
          "COST_RATE": 0,
          "SELLING_RATE": 0,
          "LAST_UPDATE": "2023-11-28T05:47:14.178Z",
          "CRACCODE": "",
          "ACCESSORIES": 0,
          "DIVISION_CODE": "",
          "SELLING_PER": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "SIEVE": "",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "",
          "SRNO": 0,
          "PROCESS_TYPE": ""
        }
      ],
      "CUSTOMER_PRICE_ACCOUNT_DET": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "PRICECODE": "",
          "ACCODE": "",
          "ACCOUNT_HEAD": "",
          "CALC_ON_GROSS": true
        }
      ]
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
                this.customerpricemasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update(){
    if (this.customerpricemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'CustomerPriceMaster/UpdateCustomerPriceMaster/'+this.content.PRICECODE
    let postData = {
      "MID": 0,
      "CUSTOMER_CODE": this.customerpricemasterForm.value.customercode || "",
      "DESCRIPTION":  this.customerpricemasterForm.value.desc || "",
      "GOLD_LOSS_PER":  this.customerpricemasterForm.value.metal_loss || 0,
      "UPDATE_ON": "2023-11-28T05:47:14.177Z",
      "PRICECODE": this.customerpricemasterForm.value.pricecode || "",
      "MARGIN_PER": this.customerpricemasterForm.value.margin || 0,
      "LAB_TYPE": this.customerpricemasterForm.value.labourtype || "",
      "MARKUP_PER":  this.customerpricemasterForm.value.markup || 0,
      "CUSTOMER_NAME":  this.customerpricemasterForm.value.text,
      "PRINT_COUNT": 0,
      "VALID_FROM": this.customerpricemasterForm.value.date,
      "ADD_ON_RATE":this.customerpricemasterForm.value.addonrate || 0,
      "CURRENCY_CODE": "str",
      "CURRENCY_RATE": 0,
      "MAIN_VOCTYPE": "string",
      "CUSTOMER_PRICE_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "",
          "PRICE_CODE": "",
          "DESCRIPTION": "",
          "SHAPE": "",
          "COLOR": "",
          "CLARITY": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "CURRENCYCODE": "",
          "ISSUE_RATE": 0,
          "SELLING_RATE": 0,
          "UPDATE_ON": "2023-11-28T05:47:14.178Z",
          "CARAT_WT": 0,
          "SIEVE": "",
          "SELLING_PER": 0,
          "UNITCODE": "",
          "LABTYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "CRACCODE": "",
          "COST_RATE": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "ACCESSORIES": 0,
          "PRICE_TYPE": 0,
          "SIEVE_SET": "",
          "WEIGHT_FROM": 0,
          "WEIGHT_TO": 0,
          "SIEVE_TO": "",
          "CUSTOMER_NAME": "",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "",
          "SRNO": 0
        }
      ],
      "CUSTOMER_LABCHRG_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "",
          "LABOUR_CODE": "",
          "LABTYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "CURRENCYCODE": "",
          "UNITCODE": "",
          "COST_RATE": 0,
          "SELLING_RATE": 0,
          "LAST_UPDATE": "2023-11-28T05:47:14.178Z",
          "CRACCODE": "",
          "ACCESSORIES": 0,
          "DIVISION_CODE": "",
          "SELLING_PER": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "SIEVE": "",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "",
          "SRNO": 0,
          "PROCESS_TYPE": ""
        }
      ],
      "CUSTOMER_PRICE_ACCOUNT_DET": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "PRICECODE": "",
          "ACCODE": "",
          "ACCOUNT_HEAD": "",
          "CALC_ON_GROSS": true
        }
      ]
    }
   
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
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
                this.customerpricemasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'CustomerPriceMaster/DeleteCustomerPriceMaster/' + this.content.PRICECODE
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.customerpricemasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.customerpricemasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
