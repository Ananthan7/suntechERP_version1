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
 
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {
  }
  customerpricemasterForm: FormGroup = this.formBuilder.group({
    customercode :[''],
    desc :[''],
    pricecode : [''],
    labourtype:[''],
    addonrate : [''],
    margin:[''],
    
   });
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.customerpricemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'CustomerPriceMaster/InsertCustomerPriceMaster'
    let postData = {
      "MID": 0,
      "CUSTOMER_CODE": this.customerpricemasterForm.value.customercode || "",
      "DESCRIPTION":  this.customerpricemasterForm.value.desc || "",
      "GOLD_LOSS_PER": 0,
      "UPDATE_ON": "2023-11-28T05:47:14.177Z",
      "PRICECODE": this.customerpricemasterForm.value.pricecode || "",
      "MARGIN_PER":0,
      "LAB_TYPE": this.customerpricemasterForm.value.labourtype || "",
      "MARKUP_PER": 0,
      "CUSTOMER_NAME": "",
      "PRINT_COUNT": 0,
      "VALID_FROM": "2023-11-28T05:47:14.177Z",
      "ADD_ON_RATE":0,
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "MAIN_VOCTYPE": "string",
      "CUSTOMER_PRICE_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "string",
          "PRICE_CODE": "string",
          "DESCRIPTION": "string",
          "SHAPE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "CURRENCYCODE": "string",
          "ISSUE_RATE": 0,
          "SELLING_RATE": 0,
          "UPDATE_ON": "2023-11-28T05:47:14.178Z",
          "CARAT_WT": 0,
          "SIEVE": "string",
          "SELLING_PER": 0,
          "UNITCODE": "string",
          "LABTYPE": "string",
          "METHOD": "string",
          "DIVISION": "string",
          "CRACCODE": "string",
          "COST_RATE": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "ACCESSORIES": 0,
          "PRICE_TYPE": 0,
          "SIEVE_SET": "string",
          "WEIGHT_FROM": 0,
          "WEIGHT_TO": 0,
          "SIEVE_TO": "string",
          "CUSTOMER_NAME": "string",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "string",
          "SRNO": 0
        }
      ],
      "CUSTOMER_LABCHRG_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "string",
          "LABOUR_CODE": "string",
          "LABTYPE": "string",
          "METHOD": "string",
          "DIVISION": "string",
          "SHAPE": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "CURRENCYCODE": "string",
          "UNITCODE": "string",
          "COST_RATE": 0,
          "SELLING_RATE": 0,
          "LAST_UPDATE": "2023-11-28T05:47:14.178Z",
          "CRACCODE": "string",
          "ACCESSORIES": 0,
          "DIVISION_CODE": "string",
          "SELLING_PER": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "SIEVE": "string",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "string",
          "SRNO": 0,
          "PROCESS_TYPE": "string"
        }
      ],
      "CUSTOMER_PRICE_ACCOUNT_DET": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "PRICECODE": "string",
          "ACCODE": "string",
          "ACCOUNT_HEAD": "string",
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
    let postData = 
    {
      "MID": 0,
      "CUSTOMER_CODE": "string",
      "DESCRIPTION": "string",
      "GOLD_LOSS_PER": 0,
      "UPDATE_ON": "2023-11-28T05:53:11.589Z",
      "PRICECODE": "string",
      "MARGIN_PER": 0,
      "LAB_TYPE": "string",
      "MARKUP_PER": 0,
      "CUSTOMER_NAME": "string",
      "PRINT_COUNT": 0,
      "VALID_FROM": "2023-11-28T05:53:11.589Z",
      "ADD_ON_RATE": 0,
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "MAIN_VOCTYPE": "string",
      "CUSTOMER_PRICE_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "string",
          "PRICE_CODE": "string",
          "DESCRIPTION": "string",
          "SHAPE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "CURRENCYCODE": "string",
          "ISSUE_RATE": 0,
          "SELLING_RATE": 0,
          "UPDATE_ON": "2023-11-28T05:53:11.590Z",
          "CARAT_WT": 0,
          "SIEVE": "string",
          "SELLING_PER": 0,
          "UNITCODE": "string",
          "LABTYPE": "string",
          "METHOD": "string",
          "DIVISION": "string",
          "CRACCODE": "string",
          "COST_RATE": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "ACCESSORIES": 0,
          "PRICE_TYPE": 0,
          "SIEVE_SET": "string",
          "WEIGHT_FROM": 0,
          "WEIGHT_TO": 0,
          "SIEVE_TO": "string",
          "CUSTOMER_NAME": "string",
          "DT_VALID_FROM": "2023-11-28T05:53:11.590Z",
          "PRICECODE": "string",
          "SRNO": 0
        }
      ],
      "CUSTOMER_LABCHRG_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "string",
          "LABOUR_CODE": "string",
          "LABTYPE": "string",
          "METHOD": "string",
          "DIVISION": "string",
          "SHAPE": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "CURRENCYCODE": "string",
          "UNITCODE": "string",
          "COST_RATE": 0,
          "SELLING_RATE": 0,
          "LAST_UPDATE": "2023-11-28T05:53:11.590Z",
          "CRACCODE": "string",
          "ACCESSORIES": 0,
          "DIVISION_CODE": "string",
          "SELLING_PER": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "SIEVE": "string",
          "DT_VALID_FROM": "2023-11-28T05:53:11.590Z",
          "PRICECODE": "string",
          "SRNO": 0,
          "PROCESS_TYPE": "string"
        }
      ],
      "CUSTOMER_PRICE_ACCOUNT_DET": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "PRICECODE": "string",
          "ACCODE": "string",
          "ACCOUNT_HEAD": "string",
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
