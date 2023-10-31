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
  selector: 'app-melting-process-details',
  templateUrl: './melting-process-details.component.html',
  styleUrls: ['./melting-process-details.component.scss']
})
export class MeltingProcessDetailsComponent implements OnInit {
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingprocessdetailsForm.controls.jobno.setValue(e.job_number);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.meltingprocessdetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  meltingprocessdetailsForm: FormGroup = this.formBuilder.group({

  });

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.meltingprocessdetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DiamondDismantle/InsertDiamondDismantle'
    let postData = {
      "MID": 0,
      "MELTYPE_CODE": this.meltingprocessdetailsForm.value.meltingType,
      "MELTYPE_DESCRIPTION": "",
      "KARAT_CODE": "",
      "PURITY": 0,
      "METAL_PER": 0,
      "ALLOY_PER": 0,
      "CREATED_BY": "",
      "COLOR": this.meltingprocessdetailsForm.value.color,
      "STOCK_CODE": "string",
      "MELTING_TYPE_DETAIL": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "MELTYPE_CODE": "string",
          "MELTYPE_DESCRIPTION": "string",
          "KARAT_CODE": "string",
          "PURITY": 0,
          "DIVISION_CODE": "string",
          "DEF_ALLOY_STOCK": "string",
          "DEF_ALLOY_DESCRIPTION": "string",
          "ALLOY_PER": 0
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
                this.meltingprocessdetailsForm.reset()
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

  setFormValues() {
  }

  update(){
    if (this.meltingprocessdetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'DiamondDismantle/UpdateDiamondDismantle'+ this.meltingprocessdetailsForm.value.branchCode + this.meltingprocessdetailsForm.value.voctype + this.meltingprocessdetailsForm.value.vocno + this.meltingprocessdetailsForm.value.yearMonth;
    let postData = {

        
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
                this.meltingprocessdetailsForm.reset()
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
    if (!this.content.VOCTYPE) {
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
        let API = 'DiamondDismantle/DeleteDiamondDismantle/'+ this.meltingprocessdetailsForm.value.branchCode + this.meltingprocessdetailsForm.value.voctype + this.meltingprocessdetailsForm.value.vocno + this.meltingprocessdetailsForm.value.yearMonth
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
                    this.meltingprocessdetailsForm.reset()
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
                    this.meltingprocessdetailsForm.reset()
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
