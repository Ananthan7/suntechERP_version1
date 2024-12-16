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
  selector: 'app-karat-master',
  templateUrl: './karat-master.component.html',
  styleUrls: ['./karat-master.component.scss']
})
export class KaratMasterComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  isDisableSaveBtn: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  editableMode: boolean = false;

  @ViewChild('overlaydivisionSearch') overlaydivisionSearch!: MasterSearchComponent;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();
    this.codeEnable = true;
    this.initializeForm();
    if (this.content?.FLAG) {
    console.log(this.content);
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.setFormValues();

      } else if (this.content.FLAG == 'EDIT') {
      this.codeEnable = false;
      this.editableMode = true;
        this.editMode = true;
       this.setFormValues();

      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }
    this.deciStdpurity();
  }

  karatmasterFrom: FormGroup = this.formBuilder.group({
    division: ['',[Validators.required]],
    karatcode: ['',[Validators.required]],
    karatcodedes: ['',[Validators.required]],
    standardpurity: ['',[Validators.required]],
    minimum: [''],
    maximum: [''],
    sp_gravity: [''],
    sp_variance: [''],
    pos: [''],
    pop_minmaxamt: [''],
    scrap: [false],
    showinweb: [false],
  })


  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e: any) {
    if (this.checkCode()) return

    console.log(e);
    this.karatmasterFrom.controls.division.setValue(e.DIVISION_CODE);
  }


  deciStdpurity() {
    const standardpurityControl = this.karatmasterFrom.get('standardpurity');
  
    if (standardpurityControl) {
      standardpurityControl.valueChanges.subscribe((value) => {
        const formattedValue = parseFloat(value || 0).toFixed(6); 
        this.karatmasterFrom.patchValue(
          {
            minimum: formattedValue,
            maximum: formattedValue,
          },
          { emitEvent: false }
        );
      });
    } else {
      console.error("Control 'standardpurity' not found in the form group.");
    }
  }
  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  private initializeForm() {
    this.karatmasterFrom.controls.standardpurity.setValue(
      this.commonService.decimalQuantityFormat(0, 'PURITY'))
    this.karatmasterFrom.controls.minimum.setValue(
      this.commonService.decimalQuantityFormat(0, 'PURITY'))
    this.karatmasterFrom.controls.maximum.setValue(
      this.commonService.decimalQuantityFormat(0, 'PURITY'))
  }

  codeEnabled() {
    if (this.karatmasterFrom.value.karatcode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }

  stdpurityval(){

    if(this.karatmasterFrom.value.standardpurity > 1.0100){
      this.commonService.toastErrorByMsgId('Purity cannot be more than 1.01000');

      this.karatmasterFrom.controls.standardpurity.setValue('');
      return;
    }

  }


  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; 
    }

    if (event.target.value === '' || this.viewMode) {
      return; 
    };
    
    const API = 'karatMaster/CheckIfKaratCodePresent/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: 'Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.karatmasterFrom.controls.karatcode.setValue('');
            this.renderer.selectRootElement('#code').focus();

          });
          this.commonService.toastErrorByMsgId('MSG1121')//Code Already Exists
        }else{
          this.codeEnable = false;
        }
      }, err => {
        this.karatmasterFrom.reset();

      });

    this.subscriptions.push(sub);

  }

  checkCode(): boolean {
    if (this.karatmasterFrom.value.karatcode == '') {
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
      return true
    }
    return false
  }

  setFormValues() {
    if (!this.content) return

    this.karatmasterFrom.controls.division.setValue(this.content.DIVISION_CODE);
    this.karatmasterFrom.controls.karatcode.setValue(this.content.KARAT_CODE);
    this.karatmasterFrom.controls.karatcodedes.setValue(this.content.KARAT_DESC);
    this.karatmasterFrom.controls.standardpurity.setValue(this.commonService.transformDecimalVB(
    this.commonService.allCompanyParameters?.MRATEDECIMALS,this.content.STD_PURITY));
    this.karatmasterFrom.controls.minimum.setValue(this.commonService.transformDecimalVB(
      this.commonService.allCompanyParameters?.MRATEDECIMALS,this.content.PURITY_FROM));
    this.karatmasterFrom.controls.maximum.setValue(this.commonService.transformDecimalVB(
      this.commonService.allCompanyParameters?.MRATEDECIMALS,this.content.PURITY_TO));
    this.karatmasterFrom.controls.sp_gravity.setValue(this.commonService.transformDecimalVB(
      this.commonService.allbranchMaster?.BMQTYDECIMALS, this.content.SPGRVT));
    this.karatmasterFrom.controls.sp_variance.setValue(this.commonService.transformDecimalVB(
      this.commonService.allbranchMaster?.BAMTDECIMALS, this.content.SPGRVT_VAR));
    this.karatmasterFrom.controls.pos.setValue(this.commonService.transformDecimalVB(
      this.commonService.allbranchMaster?.BAMTDECIMALS, this.content.POSMINMAXAMT));
    this.karatmasterFrom.controls.pop_minmaxamt.setValue(this.commonService.transformDecimalVB(
    this.commonService.allbranchMaster?.BAMTDECIMALS, this.content.POPMINMAXAMT));
    this.karatmasterFrom.controls.scrap.setValue(this.content.IS_SCRAP == 'Y' ? true : false);
    this.karatmasterFrom.controls.showinweb.setValue(this.content.SHOWINWEB == 'Y' ? true : false);

  }


  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.karatmasterFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'karatMaster/InsertKaratMaster'
    let postData = {
      "KARAT_CODE": this.commonService.nullToString(this.karatmasterFrom.value.karatcode) ,
      "STD_PURITY": this.commonService.emptyToZero(this.karatmasterFrom.value.standardpurity),
      "PURITY_FROM": this.commonService.emptyToZero(this.karatmasterFrom.value.minimum),
      "PURITY_TO": this.commonService.emptyToZero(this.karatmasterFrom.value.maximum),
      "MID":this.commonService.emptyToZero(this.content?.MID),
      "SYSTEM_DATE": "2024-11-13T09:15:17.534Z",
      "KARAT_DESC": this.commonService.nullToString(this.karatmasterFrom.value.karatcodedes),
      "SPGRVT": this.commonService.emptyToZero(this.karatmasterFrom.value.sp_gravity),
      "POSMINMAXAMT": this.commonService.emptyToZero(this.karatmasterFrom.value.pos),
      "DIVISION_CODE": this.commonService.nullToString(this.karatmasterFrom.value.division),
      "POPMINMAXAMT": this.commonService.emptyToZero(this.karatmasterFrom.value.pop_minmaxamt),
      "SPGRVT_VAR": this.commonService.emptyToZero(this.karatmasterFrom.value.sp_variance),
      "KARAT_DESC_AR": "str",
      "IS_SCRAP": this.karatmasterFrom.value.scrap,
      "SHOWINWEB": this.karatmasterFrom.value.showinweb,
    }

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
                this.karatmasterFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  update() {
    if (this.karatmasterFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'karatMaster/UpdateKaratMaster/' + this.content.KARAT_CODE;
    let postData =
    {
      "KARAT_CODE": this.commonService.nullToString(this.karatmasterFrom.value.karatcode) ,
      "STD_PURITY": this.commonService.emptyToZero(this.karatmasterFrom.value.standardpurity),
      "PURITY_FROM": this.commonService.emptyToZero(this.karatmasterFrom.value.minimum),
      "PURITY_TO": this.commonService.emptyToZero(this.karatmasterFrom.value.maximum),
      "MID":this.commonService.emptyToZero(this.content?.MID),
      "SYSTEM_DATE": "2024-11-13T09:15:17.534Z",
      "KARAT_DESC": this.commonService.nullToString(this.karatmasterFrom.value.karatcodedes),
      "SPGRVT": this.commonService.emptyToZero(this.karatmasterFrom.value.sp_gravity),
      "POSMINMAXAMT": this.commonService.emptyToZero(this.karatmasterFrom.value.pos),
      "DIVISION_CODE": this.commonService.nullToString(this.karatmasterFrom.value.division),
      "POPMINMAXAMT": this.commonService.emptyToZero(this.karatmasterFrom.value.pop_minmaxamt),
      "SPGRVT_VAR": this.commonService.emptyToZero(this.karatmasterFrom.value.sp_variance),
      "KARAT_DESC_AR": "str",
      "IS_SCRAP": this.karatmasterFrom.value.scrap,
      "SHOWINWEB": this.karatmasterFrom.value.showinweb,
    }


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
                this.karatmasterFrom.reset()
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
                    this.karatmasterFrom.reset()
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
                    this.karatmasterFrom.reset()
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
      else
      {
        this.close('reloadMainGrid')
      }
    });
  }

  
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.karatmasterFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
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
    
    openOverlay(FORMNAME: string, event: any) {
      switch (FORMNAME) {
        case 'division':
          this.overlaydivisionSearch.showOverlayPanel(event);
          break;
        default:
          console.warn(`Unknown FORMNAME: ${FORMNAME}`);
          break;
      }
    }

    showOverleyPanel(event: any, formControlName: string) {
      switch (formControlName) {
        case 'glcode':
          this.overlaydivisionSearch.showOverlayPanel(event);
          break;
        default:
      }
    }

    allowNumbersOnly(event: Event): void {
      const input = event.target as HTMLInputElement;
      input.value = input.value.replace(/[^0-9]/g, '');
  }
  

  }
