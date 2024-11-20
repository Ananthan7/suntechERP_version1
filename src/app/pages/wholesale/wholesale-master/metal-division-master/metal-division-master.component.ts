import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-metal-division-master',
  templateUrl: './metal-division-master.component.html',
  styleUrls: ['./metal-division-master.component.scss']
})
export class MetalDivisionMasterComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean=false;
  isDisableSaveBtn: boolean = false;
  viewDisable: boolean = false;

  @ViewChild('overlaycostcenterSearch') overlaycostcenterSearch!: MasterSearchComponent;
  @ViewChild('overlaycostcentermakingSearch') overlaycostcentermakingSearch!: MasterSearchComponent;
  @ViewChild('overlaystockcodeSearch') overlaystockcodeSearch!: MasterSearchComponent;


  
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
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewDisable = true;
        this.viewMode = true;
        // this.processMasterForm();
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
        this.editMode = true;
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteMetalDivision()
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
    code: ['', [Validators.required]],
    codedes: ['',[Validators.required]],
    costcenter: [''],
    stockcode: [''],
    costcentermaking: [''],
    Abbreviation: [''],
    currency: [''],
  })


  setFormValues() {
    if (!this.content) return

    this.metaldivisionForm.controls.code.setValue(this.content.DIVISION_CODE);
    this.metaldivisionForm.controls.codedes.setValue(this.content.DESCRIPTION);
    this.metaldivisionForm.controls.Abbreviation.setValue(this.content.ABBREVIATION);
    this.metaldivisionForm.controls.costcenter.setValue(this.content.COSTCODE_METAL);
    this.metaldivisionForm.controls.currency.setValue(this.content.ISCURRENCY);
    this.metaldivisionForm.controls.costcentermaking.setValue(this.content.COSTCODE_MAKING);
    this.metaldivisionForm.controls.stockcode.setValue(this.content.AUTOFIXSTOCK);

  }

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
  costCenterSelected(e: any) {
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
  costSelected(e: any) {
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
  stockCodeSelected(e: any) {
    console.log(e);
    this.metaldivisionForm.controls.stockcode.setValue(e.STOCK_CODE);
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  
  setpostData() {
    return {
      "MID": this.content?.MID || 0,
      "DIVISION_CODE": this.metaldivisionForm.value.code || "",
      "DESCRIPTION": this.metaldivisionForm.value.codedes || "",
      "DIVISION": "S",
      "REPORT_DEFAULT": "S",
      "ABBREVIATION": this.metaldivisionForm.value.Abbreviation || "",
      "SYSTEM_DATE": "2023-11-24T12:22:11.425Z",
      "COSTCODE_METAL": this.metaldivisionForm.value.costcenter || "",
      "ISCURRENCY": this.onchangeCheckBox(this.metaldivisionForm.value.currency),
      "DESCRIPTION_OTHER": "",
      "COSTCODE_MAKING": this.metaldivisionForm.value.costcentermaking || "",
      "METAL_PURITY": 0,
      "DESCRIPTION_CHINESE": "",
      "DESCRIPTION_TURKISH": "",
      "AUTOFIXSTOCK": this.metaldivisionForm.value.stockcode,
    }
  }
  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.metaldivisionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'DivisionMaster/InsertDivisionMaster'
    let postData = this.setpostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
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
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  update() {
    if (this.metaldivisionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = '/DivisionMaster/UpdateDivisionMaster/' + this.content.DIVISION_CODE
    let postData = this.setpostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
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
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  deleteMetalDivision() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
  viewchangeYorN(e: any) {
    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }
  onchangeCheckBox(e: any) {
    if (e == true) {
      return true;
    } else {
      return false;
    }
  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'costcenter':
        this.overlaycostcenterSearch.showOverlayPanel(event);
        break;
        case 'costcentermaking':
          this.overlaycostcentermakingSearch.showOverlayPanel(event);
          break;
          case 'stockcode':
          this.overlaystockcodeSearch.showOverlayPanel(event);
          break;
      default:
    }
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
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
