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
  selector: 'app-karat-master',
  templateUrl: './karat-master.component.html',
  styleUrls: ['./karat-master.component.scss']
})
export class KaratMasterComponent implements OnInit {

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  karatmasterForm: any;
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
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.karatmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'karatMaster/InsertKaratMaster'
    let postData = {
      "KARAT_CODE": "stri",
      "STD_PURITY": 0,
      "PURITY_FROM": 0,
      "PURITY_TO": 0,
      "MID": 0,
      "SYSTEM_DATE": "2023-11-24T10:50:27.839Z",
      "KARAT_DESC": "string",
      "SPGRVT": 0,
      "POSMINMAXAMT": 0,
      "DIVISION_CODE": "s",
      "POPMINMAXAMT": 0,
      "SPGRVT_VAR": 0,
      "KARAT_DESC_AR": "string",
      "IS_SCRAP": true,
      "SHOWINWEB": true
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
                this.karatmasterForm.reset()
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
    if (this.karatmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = '/karatMaster/UpdateKaratMaster/'+this.content.KARAT_CODE
    let postData = 
    {
      "KARAT_CODE": "stri",
      "STD_PURITY": 0,
      "PURITY_FROM": 0,
      "PURITY_TO": 0,
      "MID": 0,
      "SYSTEM_DATE": "2023-11-24T10:52:32.949Z",
      "KARAT_DESC": "string",
      "SPGRVT": 0,
      "POSMINMAXAMT": 0,
      "DIVISION_CODE": "s",
      "POPMINMAXAMT": 0,
      "SPGRVT_VAR": 0,
      "KARAT_DESC_AR": "string",
      "IS_SCRAP": true,
      "SHOWINWEB": true
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
                this.karatmasterForm.reset()
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
        let API = 'karatMaster/DeleteKaratMaster/' + this.content.KARAT_CODE
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
                    this.karatmasterForm.reset()
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
                    this.karatmasterForm.reset()
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
