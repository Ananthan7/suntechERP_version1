import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-service-master',
  templateUrl: './service-master.component.html',
  styleUrls: ['./service-master.component.scss']
})
export class ServiceMasterComponent implements OnInit {
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;

  @ViewChild('accountcodeSearch') accountcodeSearch!: MasterSearchComponent;
  @ViewChild('designCodeSearch') designCodeSearch!: MasterSearchComponent;
  @ViewChild('hsnCodeSearch') hsnCodeSearch!: MasterSearchComponent;
  @ViewChild('filterinvoctypeCodeSearch') filterinvoctypeCodeSearch!: MasterSearchComponent;
  @ViewChild('filtersalesCodeSearch') filtersalesCodeSearch!: MasterSearchComponent;
  @ViewChild('filtersalesreturnCodeSearch') filtersalesreturnCodeSearch!: MasterSearchComponent;
  @ViewChild('purchaseCodeSearch') purchaseCodeSearch!: MasterSearchComponent;
  @ViewChild('salesCodeSearch') salesCodeSearch!: MasterSearchComponent;
  @ViewChild('branchtransferCodeSearch') branchtransferCodeSearch!: MasterSearchComponent;



  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {

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

  serviceForm: FormGroup = this.formBuilder.group({
    servicecode: ['', [Validators.required]],
    excludeTax: [''],
    askAcTrans: [''],
    description: [''],
    account: [''],
    amountAED: [''],
    designCode: [''],
    hsn: [''],
    filterinvoctype: [''],
    filtersales: [''],
    filtersalesreturn: [''],
    purchase: [''],
    sales: [''],
    branchtransfer: [''],

  })

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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

  setFormValues() {
    if (!this.content) return

    this.serviceForm.controls.servicecode.setValue(this.content.SERVICE_CODE)
    this.serviceForm.controls.description.setValue(this.content.DESCRIPTION)
    this.serviceForm.controls.account.setValue(this.content.ACCODE)
    this.serviceForm.controls.amountAED.setValue(this.commonService.transformDecimalVB(
      this.commonService.allbranchMaster?.BAMTDECIMALS, this.content.SERVICEAMOUNT))
    this.serviceForm.controls.filtersales.setValue(this.content.SM_BRANCHCODE)
    this.serviceForm.controls.filterinvoctype.setValue(this.content.FILTERVOCTYPE)
    this.serviceForm.controls.purchase.setValue(this.content.PURCHASE_GST)
    this.serviceForm.controls.sales.setValue(this.content.SALES_GST)
    this.serviceForm.controls.branchtransfer.setValue(this.content.BRANCH_TRANSFER_GST)
    this.serviceForm.controls.excludeTax.setValue(this.content.EXCLUDEGSTVAT === 'Y' ? true : false)
    this.serviceForm.controls.filtersalesreturn.setValue(this.content.HSN_SAC_CODE)
    this.serviceForm.controls.askAcTrans.setValue(this.content.ASK_ACCOUNT === 'Y' ? true : false)
    this.serviceForm.controls.designCode.setValue(this.content.DESIGN_CODE)
    this.serviceForm.controls.hsn.setValue(this.content.HSN_CODE)

  }

  setPostData() {
    return {
      "MID": 0,
      "SERVICE_CODE": this.commonService.nullToString(this.serviceForm.value.servicecode),
      "DESCRIPTION": this.commonService.nullToString(this.serviceForm.value.description),
      "ACCODE": this.commonService.nullToString(this.serviceForm.value.account),
      "SERVICEAMOUNT": this.commonService.emptyToZero(this.serviceForm.value.amountAED),
      "SM_BRANCHCODE": this.commonService.nullToString(this.serviceForm.value.filtersales),
      "FILTERVOCTYPE": this.commonService.nullToString(this.serviceForm.value.filterinvoctype),
      "PURCHASE_GST": this.commonService.nullToString(this.serviceForm.value.purchase),
      "SALES_GST": this.commonService.nullToString(this.serviceForm.value.sales),
      "BRANCH_TRANSFER_GST": this.commonService.nullToString(this.serviceForm.value.branchtransfer),
      "EXCLUDEGSTVAT": this.serviceForm.value.excludeTax,
      "HSN_SAC_CODE": this.commonService.nullToString(this.serviceForm.value.filtersalesreturn),
      "ASK_ACCOUNT": this.serviceForm.value.askAcTrans,
      "DESIGN_CODE": this.commonService.nullToString(this.serviceForm.value.designCode),
      "HSN_CODE": this.commonService.nullToString(this.serviceForm.value.hsn),
      "PCSWISEBOILCHARGE": true
    }

  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.serviceForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ServiceMaster/InsertServiceMaster'
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
              this.serviceForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  update() {
    if (this.serviceForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ServiceMaster/UpdateServiceMaster/' + this.content.SERVICE_CODE;
    let postData = this.setPostData()


    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
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
              this.serviceForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  deleteRecord() {
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
        let API = 'ServiceMaster/DeleteServiceMaster/' + this.content.SERVICE_CODE
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
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
                  this.serviceForm.reset()
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
                  this.serviceForm.reset()
                  this.tableData = []
                  this.close()
                }
              });
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }




  accountCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Account Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  accountCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.account.setValue(e.ACCODE);
  }

  designCodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 16,
    SEARCH_FIELD: 'designCode',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  designCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.designCode.setValue(e.Design_Code);
  }


  hsnCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HSN',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'HSN MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  hsnCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.hsn.setValue(e.CODE);
  }



  FilterVoctypeCodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 88,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Filter Voc Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "MAIN_VOCTYPE IN ('PSS','DEXPS','PSP','IMSP')  AND BRANCH_CODE = '" + this.commonService.branchCode + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  FilterVoctypeCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.filterinvoctype.setValue(e.VOCTYPE);
  }

  FiltersalesVoctypeCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.filtersales.setValue(e.VOCTYPE);
  }

  FiltersalesreturnCodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 88,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Filter Sales Return Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "MAIN_VOCTYPE IN ('PSS','DEXPS','PSP','IMSP')  AND BRANCH_CODE = '" + this.commonService.branchCode + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  FiltersalesreturnSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.filtersalesreturn.setValue(e.VOCTYPE);
  }

  purchaseCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Purchase Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  purchaseSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.purchase.setValue(e.GST_CODE);
  }

  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Sales Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  salesCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.sales.setValue(e.GST_CODE);
  }

  branchtransferCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Branch Transfer',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchtransferCodeSelected(e: any) {
    console.log(e);
    this.serviceForm.controls.sales.setValue(e.GST_CODE);
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
          this.serviceForm.controls[FORMNAME].setValue('')
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
      case 'account':
        this.accountcodeSearch.showOverlayPanel(event);
        break;
      case 'designCode':
        this.designCodeSearch.showOverlayPanel(event);
        break;
      case 'hsn':
        this.hsnCodeSearch.showOverlayPanel(event);
        break;
      case 'filterinvoctype':
        this.filterinvoctypeCodeSearch.showOverlayPanel(event);
        break;
      case 'filtersales':
        this.filtersalesCodeSearch.showOverlayPanel(event);
        break;
      case 'filtersalesreturn':
        this.filtersalesreturnCodeSearch.showOverlayPanel(event);
        break;
      case 'purchase':
        this.purchaseCodeSearch.showOverlayPanel(event);
        break;
      case 'sales':
        this.salesCodeSearch.showOverlayPanel(event);
        break;
      case 'branchtransfer':
        this.branchtransferCodeSearch.showOverlayPanel(event);
        break;



      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'account':
        this.accountcodeSearch.showOverlayPanel(event);
        break;
      case 'designCode':
        this.designCodeSearch.showOverlayPanel(event);
        break;
      case 'hsn':
        this.hsnCodeSearch.showOverlayPanel(event);
        break;
      case 'filterinvoctype':
        this.filterinvoctypeCodeSearch.showOverlayPanel(event);
        break;
      case 'filtersales':
        this.filtersalesCodeSearch.showOverlayPanel(event);
        break;
      case 'filtersalesreturn':
        this.filtersalesreturnCodeSearch.showOverlayPanel(event);
        break;
      case 'purchase':
        this.purchaseCodeSearch.showOverlayPanel(event);
        break;
      case 'sales':
        this.salesCodeSearch.showOverlayPanel(event);
        break;
      case 'branchtransfer':
        this.branchtransferCodeSearch.showOverlayPanel(event);
        break;



      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

}
