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
  selector: 'app-sales-person-master',
  templateUrl: './sales-person-master.component.html',
  styleUrls: ['./sales-person-master.component.scss']
})
export class SalesPersonMasterComponent implements OnInit {
  divisionMS: any = 'ID';
  private subscriptions: Subscription[] = [];

  @Input() content!: any;
  tableData: any[] = [];
  editableMode: boolean = false;
  viewMode: boolean = false;
  userbranch = localStorage.getItem('userbranch');
  editMode:boolean = false;

  @ViewChild('overlaybranchSearch') overlaybranchSearch!: MasterSearchComponent;
  @ViewChild('overlayemployeecodeSearch') overlayemployeecodeSearch!: MasterSearchComponent;
  @ViewChild('overlayglcodeSearch') overlayglcodeSearch!: MasterSearchComponent;



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

    if (this.content?.FLAG) {
      console.log(this.content)
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }
  }
  
  salesPersonForm: FormGroup = this.formBuilder.group({
    code: [''],
    active: [''],
    description: [''],
    shortname: [''],
    commisionMetal: [''],
    commisionOthers: [''],
    mobile: [''],
    branch: [''],
    employeecode: [''],
    glcode: [''],
    emailId: [''],
  })

  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.salesPersonForm.controls.code.setValue(this.content.SALESPERSON_CODE)
    this.salesPersonForm.controls.description.setValue(this.content.DESCRIPTION)
    this.salesPersonForm.controls.commisionMetal.setValue(this.commonService.transformDecimalVB(
      this.commonService.allCompanyParameters?.BAMTDECIMALS, this.content.COMMISSION))
    this.salesPersonForm.controls.shortname.setValue(this.content.SP_SHORTNAME)
    this.salesPersonForm.controls.branch.setValue(this.content.SP_BRANCHCODE)
    this.salesPersonForm.controls.employeecode.setValue(this.content.EMPMST_CODE)
    this.salesPersonForm.controls.active.setValue(this.content.ACTIVE === 'Y' ? true : false)
    this.salesPersonForm.controls.glcode.setValue(this.content.SPACCODE)
    this.salesPersonForm.controls.commisionOthers.setValue(this.commonService.transformDecimalVB(
      this.commonService.allCompanyParameters?.BAMTDECIMALS,this.content.COMMISSIONDIA))
   
  }


  BranchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.branch.setValue(e.BRANCH_CODE);
  }

  EmployeeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 61,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Employee',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  EmployeeSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.employeecode.setValue(e.EMPMST_CODE);
  }

  glCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'GL CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  glSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.glcode.setValue(e.ACCODE);
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

  setPostData(){

   
    // mobile: [''],
    // emailId: [''],


    return {
      "SALESPERSON_CODE": this.commonService.nullToString(this.salesPersonForm.value.code),
      "DESCRIPTION": this.commonService.nullToString(this.salesPersonForm.value.description),
      "COMMISSION": this.commonService.emptyToZero(this.salesPersonForm.value.commisionMetal),
      "MID": 0,
      "SALESMAN_IMAGE_PATH": "",
      "SALESMAN_IMAGE": "",
      "SYSTEM_DATE": "2024-11-27T11:06:03.169Z",
      "SP_SHORTNAME": this.commonService.nullToString(this.salesPersonForm.value.shortname),
      "SP_BRANCHCODE": this.commonService.nullToString(this.salesPersonForm.value.branch),
      "EMPMST_CODE":this.commonService.nullToString(this.salesPersonForm.value.employeecode),
      "ACTIVE": this.salesPersonForm.value.active,
      "SPACCODE": this.commonService.nullToString(this.salesPersonForm.value.glcode),
      "COMMISSIONDIA": this.commonService.emptyToZero(this.salesPersonForm.value.commisionOthers)
    }
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
  

    let API = 'SalesPersonMaster/InsertSalesPersonMaster'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.salesPersonForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
 
  update() {
    if (this.salesPersonForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'SalesPersonMaster/UpdateSalesPersonMaster/' + this.content.SALESPERSON_CODE;
    let postData = this.setPostData()
  
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
                this.salesPersonForm.reset()
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


  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; 
    }

    if (event.target.value === '' || this.viewMode) {
      return; 
    }

    
    const API = 'SalesPersonMaster/CheckIfSalesPersonCodePresent/' + event.target.value;
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
            this.salesPersonForm.controls.code.setValue('');
            this.renderer.selectRootElement('#code').focus();
          });
          this.commonService.toastErrorByMsgId('MSG1121')
        }
      }, err => {
        this.salesPersonForm.reset();

      });

    this.subscriptions.push(sub);

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
        let API = 'SalesPersonMaster/DeleteSalesPersonMaster/' + this.content.SALESPERSON_CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
              console.log("stRT");

                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.salesPersonForm.reset()
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
                    this.salesPersonForm.reset()
                    this.tableData = []
                    this.close()

                  }
                });
              }
            }
            else{
              this.close('reloadMainGrid')
            }
            
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else{
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

        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.salesPersonForm.controls[FORMNAME].setValue('')
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


  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'branch':
        this.overlaybranchSearch.showOverlayPanel(event);
        break;
        case 'employee':
          this.overlayemployeecodeSearch.showOverlayPanel(event);
          break;
          case 'glcode':
            this.overlayglcodeSearch.showOverlayPanel(event);
            break;
          
        

      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'branch':
        this.overlaybranchSearch.showOverlayPanel(event);
        break;
        case 'employee':
          this.overlayemployeecodeSearch.showOverlayPanel(event);
          break;
          case 'glcode':
            this.overlayglcodeSearch.showOverlayPanel(event);
            break;
          


      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

  allowNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
}
}

