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
    this.ratetypeFrom.controls.metal.setValue(e.COST_CODE);
  }
  

 ratetypeFrom: FormGroup = this.formBuilder.group({
    metal:[''],
    ratetype:[''],
    convfactGMS:[''],
    currency:[''],
    status :[''],
    currrate:[''],
    ratevariance:[''],
    posmarginmin:[''],
    posmarginmax:[''],
    convfactOZ:[''],
    addonrate:[''],
    defaultratetype:[''],
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
    if (this.ratetypeFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'RateTypeMaster/InsertRateTypeMaster'
    let postData = {
      "RATE_TYPE": this.ratetypeFrom.value.ratetype || "",
      "DIVISION_CODE": "s",
      "VARIANCE": this.ratetypeFrom.value.ratevariance || "",
      "POS_MARGIN_MIN": this.ratetypeFrom.value.posmarginmin || "",
      "POS_MARGIN_MAX": this.ratetypeFrom.value.posmarginmax || "",
      "CONV_FACTOR": this.ratetypeFrom.value.convfactGMS || "",
      "CONV_FACTOR_OZ": this.ratetypeFrom.value.convfactOZ || "",
      "CURRENCY_CODE": this.ratetypeFrom.value.currency || "",
      "MUL_DIV": "s",
      "CURRENCY_RATE": this.ratetypeFrom.value.currrate || "",
      "DEFAULT_RTYPE": this.ratetypeFrom.value.defaultratetype || "",
      "WHOLESALE_RATE": 0,
      "POS_RATE": 0,
      "MID": 0,
      "SYSTEM_DATE": "2023-11-24T12:15:04.814Z",
      "RTMBRANCH_CODE": "string",
      "POP_RATE": 0,
      "ADD_ON_RATE": this.ratetypeFrom.value.addonrate || "",
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
                this.ratetypeFrom.reset()
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
    if (this.ratetypeFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = '/RateTypeMaster/UpdateRateTypeMaster/'+this.content.RATE_TYPE
    let postData = 
    {
      "RATE_TYPE": this.ratetypeFrom.value.ratetype || "",
      "DIVISION_CODE": "s",
      "VARIANCE": this.ratetypeFrom.value.ratevariance || "",
      "POS_MARGIN_MIN": this.ratetypeFrom.value.posmarginmin || "",
      "POS_MARGIN_MAX": this.ratetypeFrom.value.posmarginmax || "",
      "CONV_FACTOR": this.ratetypeFrom.value.convfactGMS || "",
      "CONV_FACTOR_OZ": this.ratetypeFrom.value.convfactOZ || "",
      "CURRENCY_CODE": this.ratetypeFrom.value.currency || "",
      "MUL_DIV": "s",
      "CURRENCY_RATE": this.ratetypeFrom.value.currrate || "",
      "DEFAULT_RTYPE": this.ratetypeFrom.value.defaultratetype || "",
      "WHOLESALE_RATE": 0,
      "POS_RATE": 0,
      "MID": 0,
      "SYSTEM_DATE": "2023-11-24T12:15:04.814Z",
      "RTMBRANCH_CODE": "string",
      "POP_RATE": 0,
      "ADD_ON_RATE": this.ratetypeFrom.value.addonrate || "",
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
                this.ratetypeFrom.reset()
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
                    this.ratetypeFrom.reset()
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
                    this.ratetypeFrom.reset()
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
