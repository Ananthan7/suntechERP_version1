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
  selector: 'app-rate-type',
  templateUrl: './rate-type.component.html',
  styleUrls: ['./rate-type.component.scss']
})
export class RateTypeComponent implements OnInit {

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  ratetypeForm: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  metalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Metal Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  metalCodeSelected(e:any){
    console.log(e);
    this.metalrateFrom.controls.metal.setValue(e.COST_CODE);
  }
  

  metalrateFrom: FormGroup = this.formBuilder.group({
    metal:[''],
    rateType:[''],
    convFactGMS:[''],
    currency:[''],
    currRate:[''],
    rateVariance:[''],
    posMarginMin:[''],
    posMarginMax:[''],
    convFactOZ:[''],
    addOnRate:[''],
  });
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.ratetypeForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'RateTypeMaster/InsertRateTypeMaster'
    let postData = {
      "RATE_TYPE": "string",
      "DIVISION_CODE": "s",
      "VARIANCE": 0,
      "POS_MARGIN_MIN": 0,
      "POS_MARGIN_MAX": 0,
      "CONV_FACTOR": 0,
      "CONV_FACTOR_OZ": 0,
      "CURRENCY_CODE": "stri",
      "MUL_DIV": "s",
      "CURRENCY_RATE": 0,
      "DEFAULT_RTYPE": true,
      "WHOLESALE_RATE": 0,
      "POS_RATE": 0,
      "MID": 0,
      "SYSTEM_DATE": "2023-11-24T12:15:04.814Z",
      "RTMBRANCH_CODE": "string",
      "POP_RATE": 0,
      "ADD_ON_RATE": 0
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
                this.ratetypeForm.reset()
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
    if (this.ratetypeForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = '/RateTypeMaster/UpdateRateTypeMaster/'+this.content.RATE_TYPE
    let postData = 
    {
      "RATE_TYPE": "string",
      "DIVISION_CODE": "s",
      "VARIANCE": 0,
      "POS_MARGIN_MIN": 0,
      "POS_MARGIN_MAX": 0,
      "CONV_FACTOR": 0,
      "CONV_FACTOR_OZ": 0,
      "CURRENCY_CODE": "stri",
      "MUL_DIV": "s",
      "CURRENCY_RATE": 0,
      "DEFAULT_RTYPE": true,
      "WHOLESALE_RATE": 0,
      "POS_RATE": 0,
      "MID": 0,
      "SYSTEM_DATE": "2023-11-24T12:16:27.639Z",
      "RTMBRANCH_CODE": "string",
      "POP_RATE": 0,
      "ADD_ON_RATE": 0
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
                this.ratetypeForm.reset()
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
        let API = 'RateTypeMaster/DeleteRateTypeMaster/' + this.content.RATE_TYPE
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
                    this.ratetypeForm.reset()
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
                    this.ratetypeForm.reset()
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
