import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-division-master',
  templateUrl: './metal-division-master.component.html',
  styleUrls: ['./metal-division-master.component.scss']
})
export class MetalDivisionMasterComponent implements OnInit {

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private commonService: CommonServiceService,
  ) { }
 
 
  ngOnInit(): void {

    if (this.content?.FLAG) {
     
      if (this.content.FLAG == 'VIEW') {
      
        this.viewMode = true;
        // this.processMasterForm();
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
      }
    }
  }
  

  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }


  metaldivisionForm: FormGroup = this.formBuilder.group({
    code:['',[Validators.required]],
    codedes:[''],
    costcenter:[''],
    stockcode:[''],
    costcentermaking:[''],
    Abbreviation:[''],
    currency:[''],
  })


  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }

    const API = 'DivisionMaster/CheckIfDivisionCodePresent/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Division Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.metaldivisionForm.controls.code.setValue('');

            setTimeout(() => {
              this.renderer.selectRootElement('#code').focus();
            }, 500);

          });
        }
      }, err => {
        this.metaldivisionForm.reset();
      });

    this.subscriptions.push(sub);
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
  costCenterSelected(e:any){
    console.log(e);
    this.metaldivisionForm.controls.costcenter.setValue(e.COST_CODE);
  }

  costData: MasterSearchModel = {
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
  costSelected(e:any){
    console.log(e);
    this.metaldivisionForm.controls.costcentermaking.setValue(e.COST_CODE);
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(e:any){
    console.log(e); 
    this.metaldivisionForm.controls.stockcode.setValue(e.STOCK_CODE);
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
    if (this.metaldivisionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DivisionMaster/InsertDivisionMaster'
    let postData = {
      "MID": 0,
      "DIVISION_CODE": this.metaldivisionForm.value.code || "",
      "DESCRIPTION":this.metaldivisionForm.value.codedes || "",
      "DIVISION": "s",
      "REPORT_DEFAULT": "s",
      "ABBREVIATION": this.metaldivisionForm.value.Abbreviation || "",
      "SYSTEM_DATE": "2023-11-24T12:22:11.425Z",
      "COSTCODE_METAL": this.metaldivisionForm.value.costcenter || "",
      "ISCURRENCY": this.metaldivisionForm.value.currency || false,
      "DESCRIPTION_OTHER": "string",
      "COSTCODE_MAKING":this.metaldivisionForm.value.costcentermaking || "",
      "METAL_PURITY": 0,
      "DESCRIPTION_CHINESE": "string",
      "DESCRIPTION_TURKISH": "string",
      "AUTOFIXSTOCK": this.metaldivisionForm.value.stockcode || "",
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
                this.metaldivisionForm.reset()
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
    if (this.metaldivisionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = '/DivisionMaster/UpdateDivisionMaster/'+this.content.DIVISION_CODE
    let postData = 
    {
      "MID": 0,
      "DIVISION_CODE": this.metaldivisionForm.value.code || "",
      "DESCRIPTION":this.metaldivisionForm.value.codedes || "",
      "DIVISION": "s",
      "REPORT_DEFAULT": "s",
      "ABBREVIATION": this.metaldivisionForm.value.Abbreviation || "",
      "SYSTEM_DATE": "2023-11-24T12:22:11.425Z",
      "COSTCODE_METAL": this.metaldivisionForm.value.costcenter || "",
      "ISCURRENCY": this.metaldivisionForm.value.currency || "",
      "DESCRIPTION_OTHER": "string",
      "COSTCODE_MAKING":this.metaldivisionForm.value.costcentermaking || "",
      "METAL_PURITY": 0,
      "DESCRIPTION_CHINESE": "string",
      "DESCRIPTION_TURKISH": "string",
      "AUTOFIXSTOCK": this.metaldivisionForm.value.stockcode || "",
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
                this.metaldivisionForm.reset()
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
        let API = 'DivisionMaster/DeleteDivisionMaster/' + this.content.DIVISION_CODE
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
                    this.metaldivisionForm.reset()
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
                    this.metaldivisionForm.reset()
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

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION?`AND ${LOOKUPDATA.WHERECONDITION}`:''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.metaldivisionForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }

}
