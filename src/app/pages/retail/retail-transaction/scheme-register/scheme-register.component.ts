import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheme-register',
  templateUrl: './scheme-register.component.html',
  styleUrls: ['./scheme-register.component.scss']
})
export class SchemeRegisterComponent implements OnInit {
  @ViewChild('add_scheme') add_scheme: any;
  @ViewChild('pos_customer_search') pos_customer_search: any;
  schemeRegistrationForm: FormGroup;
  formdata = new FormData();   
  isLoading: boolean = false
  viewOnly: boolean = false;
  isViewSchemeMasterGrid: boolean = true;

  selectedFieldValue: string = '';

  schemeReceiptList: any[] = [];
  schemeReceiptListHead: any[] = [];
  newSchemeItems: any[] = [];
  IdTypesList: any[] = [];
  searchFlag: any
  schemeArray: any[] = []
  dataToEditrow: any[] = [];
  detailArray: any[] = []
  indexNumberStart:number = 0
  newSchemeLength:number = 0

  customerMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterWithName: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'NAME',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterWithMobile: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'MOBILE',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.editMainGridDetails = this.editMainGridDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.deleteRow = this.deleteRow.bind(this);

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    this.schemeRegistrationForm = this.formBuilder.group({
      SchemeId: [''],
      Code: ['', Validators.required],
      Name: ['', Validators.required],
      MobileNo: ['', Validators.required],
      Email: ['', [Validators.pattern(emailPattern)]],
      GovIdType: [''],
      GovIdNumber: [''],
    });
    this.getSchemMasterGirdData()

  }
  ngOnInit(): void {
    let no = this.commonService.getCompanyParamValue('CUSTNO')
  }
  ngAfterViewInit(): void {
    this.getIDtypes() //ID master list
  }
  customizeDate(data: any) {
    if (!data.value) return
    return data.value.slice(0, 10)
  }
  openAttchments(e: any){
    const columnName = e.column?.dataField;
    const cellValue = e.data[columnName];
    
    // Handle the cell click event based on the column and value
    if (columnName === 'IS_ATTACHMENT_PRESENT' ) {
      let SCHEME_UNIQUEID = e.row.data.SCHEME_UNIQUEID;
      let API = `Scheme/GetSchemeAttachments?SCHEME_UNIQUEID=${SCHEME_UNIQUEID}`
      this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        if (result.fileCount > 0) {

          for (let j = 0; j < result.file.length; j++) {
            window.open(
              result.file[j],
              '_blank' // <- This is what makes it open in a new window.
            );
          }
        }else{
          this.toastr.error(result.message, '', {
            timeOut: 1000
          });
        }
      })
    }
  }
  addScheme() {
    this.isViewSchemeMasterGrid = false
  }
  fetchSchemeWithCustCode(SCHEME_CUSTCODE: string) {
    let API = `Scheme/SchemeMaster?SCHEME_CUSTCODE=${SCHEME_CUSTCODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        
        if (result.response && result.response.length > 0) {
          this.newSchemeItems = result.response
          this.newSchemeItems.length
        }else{
          this.newSchemeItems = []
        }
      })
    this.subscriptions.push(Sub)
  }
  exportToExcel(){
    this.commonService.exportExcel(this.schemeReceiptList,'Scheme Details')
  }
  getSchemMasterGirdData() {
    this.snackBar.open('Loading ...');
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/SchemeMaster')
      .subscribe((result: any) => {
        this.snackBar.dismiss()
        if (result.response.length > 0) {
          this.schemeReceiptList = result.response
          this.schemeReceiptList.map((s: any, i: any) => s.id = i + 1);
          this.schemeReceiptList.forEach((item: any, i: any) => {
            item.Id = i + 1;
          });
          this.schemeReceiptListHead = Object.keys(this.schemeReceiptList[0]);
          this.schemeReceiptListHead.unshift(this.schemeReceiptListHead.pop())
          // this.ChangeDetector.detectChanges()
        }
      },err=> this.snackBar.dismiss())

    this.subscriptions.push(Sub)

  }
  /**schemeID change function */
  schemeIDChange(event: any) {
    if (event.target.value == '') return
    let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        let sataus = result.status.trim().toLowerCase()
        if (sataus == 'success') {
          if (result.response['SCHEME_CUSTCODE']) {
            let event = { target: { value: result.response['SCHEME_CUSTCODE'] } }
            this.searchValueChange(event, 'CODE',true)
          }
          this.newSchemeItems = []
          this.newSchemeItems.push(result.response)
        
        } else {
          Swal.fire({
            title: 'Scheme Id Not Found',
            text: "",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        }
      });
    this.subscriptions.push(Sub)
  }
  /**USE get Nationalitycode from API */
  getIDtypes() {
    let API = 'Scheme/GeneralMaster/GetWithTypes?TYPES=ID MASTER'
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.IdTypesList = result.response;
      });
    this.subscriptions.push(Sub)
  }
  //search Value Change SCHEME_CUSTCODE
  searchValueChange(event: any, searchFlag: string,schemeFlag?: boolean) {
    this.searchFlag = searchFlag;
    if (event.target.value == '') return
    let API = `Scheme/CustomerMaster?${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.selectedCustomer(result.response,schemeFlag)
      } else {
        this.reset()
        // this.changeCode(event,searchFlag)
        Swal.fire({
          title: 'Customer Not Found!',
          text: "",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          // if (result.isConfirmed) {
          // }
        })
      }
    }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  /**USE: save button click */
  formSubmit() {
    if (this.schemeRegistrationForm.invalid) {
      this.toastr.error('select all details!', 'Error', {
        timeOut: 1000
      });
      return
    }
    
    if (this.indexNumberStart == 0) {
      Swal.fire({
        title: 'Add New Schemes!',
        text: "",
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        // if (result.isConfirmed) {
        // }
      })
      return
    }
    this.schemeArray = this.newSchemeItems.filter((item:any) => item.ID>0 )
    // let Model = []
    console.log(this.detailArray,'this.detailArray2');
    this.detailArray.forEach((item:any,index:any)=>{
      delete item.CustomerData['ID'];
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_UNIQUEID`, '');
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_ID`, item.CustomerData.SCHEME_ID);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_UNITS`, item.CustomerData.SCHEME_UNITS);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_TOTAL_VALUE`, item.CustomerData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_STARTED`, this.commonService.formatDate(new Date(item.CustomerData.SCHEME_STARTED)));
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_ENDEDON`, this.commonService.formatDate(new Date(item.CustomerData.SCHEME_ENDEDON)));
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_STATUS`, item.CustomerData.SCHEME_STATUS);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_UNITVALUE`, item.CustomerData.SCHEME_UNITVALUE);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_CUSTCODE`, item.CustomerData.SCHEME_CUSTCODE);
      this.formdata.append(`Model[${index}].CustomerData.sbranch_code`, item.CustomerData.sbranch_code);
      this.formdata.append(`Model[${index}].CustomerData.PCS_SYSTEM_DATE`, this.commonService.formatDate(new Date(item.CustomerData.PCS_SYSTEM_DATE)));
      this.formdata.append(`Model[${index}].CustomerData.SalesManCode`, item.CustomerData.SalesManCode);
      this.formdata.append(`Model[${index}].CustomerData.AttachmentPath`, '');
      this.formdata.append(`Model[${index}].CustomerData.BANK_ACCOUNTNO`, item.CustomerData.BANK_ACCOUNTNO);
      this.formdata.append(`Model[${index}].CustomerData.BANK_IBANNO`, item.CustomerData.BANK_IBANNO);
      this.formdata.append(`Model[${index}].CustomerData.BANK_SWIFTID`, item.CustomerData.BANK_SWIFTID);
      this.formdata.append(`Model[${index}].CustomerData.BANK_EMISTARTDATE`, this.commonService.formatDate(new Date(item.CustomerData.BANK_EMISTARTDATE)));
      this.formdata.append(`Model[${index}].CustomerData.BANK_EMIENDDATE`, this.commonService.formatDate(new Date(item.CustomerData.BANK_EMIENDDATE)));
      this.formdata.append(`Model[${index}].CustomerData.ACTIVE`, item.CustomerData.ACTIVE);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_REMARKS`, item.CustomerData.SCHEME_REMARKS);
      this.formdata.append(`Model[${index}].CustomerData.CUSTOMER_ACCOUNTNO`, item.CustomerData.CUSTOMER_ACCOUNTNO);
      this.formdata.append(`Model[${index}].CustomerData.BANK_DATE`, this.commonService.formatDate(new Date(item.CustomerData.BANK_DATE)));
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_BLOCK`, item.CustomerData.SCHEME_BLOCK);
      this.formdata.append(`Model[${index}].CustomerData.SCHEME_ControlRedeemDate`, this.commonService.formatDate(new Date(item.CustomerData.SCHEME_ControlRedeemDate)));
      this.formdata.append(`Model[${index}].ImageData.BRANCH_CODE`, item.ImageData.BRANCH_CODE);
      this.formdata.append(`Model[${index}].ImageData.VOCTYPE`, item.ImageData.VOCTYPE);
      this.formdata.append(`Model[${index}].ImageData.YEARMONTH`, item.ImageData.YEARMONTH);
      this.formdata.append(`Model[${index}].ImageData.VOCNO`, item.ImageData.VOCNO);
      for (let i:number = 0; i < item.Images.length; i++) {    
        this.formdata.append("Images["+i+"].Image.File", item.Images[i]);                
      }  
    })
   
    //save API
    this.isLoading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI('Scheme/SchemeMaster/InsertWithAttachments', this.formdata)
      .subscribe((result: any) => {
        this.isLoading = false;
        if (result.status == "Success") {
          this.detailArray = []
          this.indexNumberStart = 0
          this.formdata = new FormData();
          this.fetchSchemeWithCustCode(this.schemeRegistrationForm.value.Code)
          Swal.fire({
            title: result.status,
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            
          })
        } else {
          Swal.fire({
            title: result.message ? result.message : 'Scheme Not Saved, try again',
            text: "",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        }
      }, err => {
        alert(err)
        this.isLoading = false;
      })
    this.subscriptions.push(Sub)
  }
  saveClick(){
    this.schemeRegistrationForm.reset()
    this.getSchemMasterGirdData()
    this.isViewSchemeMasterGrid = true;

    this.isLoading = false
    this.schemeReceiptList = [];
    this.schemeReceiptListHead = [];
    this.newSchemeItems = [];
    this.IdTypesList = [];
    this.schemeArray = []
    this.dataToEditrow = [];
  }
  selectedCustomer(data: any,schemeFlag?:boolean) {
    console.log(data,'fired');
    
    this.schemeRegistrationForm.controls.Code.setValue(data.CODE)
    this.schemeRegistrationForm.controls.MobileNo.setValue(data.MOBILE)
    this.schemeRegistrationForm.controls.Name.setValue(data.NAME)
    this.schemeRegistrationForm.controls.Email.setValue(data.EMAIL)
    this.schemeRegistrationForm.controls.GovIdType.setValue(data.Idcategory)
    this.schemeRegistrationForm.controls.GovIdNumber.setValue(data.POSCustIDNo)
    if(data.CODE && !schemeFlag) this.fetchSchemeWithCustCode(data.CODE)
  }
  reset() {
    this.schemeRegistrationForm.controls.Code.setValue('')
    this.schemeRegistrationForm.controls.MobileNo.setValue('')
    this.schemeRegistrationForm.controls.Name.setValue('')
    this.schemeRegistrationForm.controls.Email.setValue('')
    this.schemeRegistrationForm.controls.GovIdType.setValue(null)
    this.schemeRegistrationForm.controls.GovIdNumber.setValue('')
  }

  cancel() {
    this.indexNumberStart = 0
    this.reset()
    this.getSchemMasterGirdData()
    this.isViewSchemeMasterGrid = true;
    this.detailArray = []
    this.isLoading = false
    this.schemeReceiptList = [];
    this.schemeReceiptListHead = [];
    this.newSchemeItems = [];
    this.schemeArray = []
    this.dataToEditrow = [];
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  //  open Jobcard in modal
  openMadalView(data?: any) {
    if(data){
      this.dataToEditrow = []
      this.dataToEditrow.push(data)
    }else{
      this.dataToEditrow = []
    }
    if (this.schemeRegistrationForm.invalid) {
      this.toastr.error('', 'select all details!', {
        timeOut: 1000
      });
      return
    }
    this.modalService.open(this.add_scheme, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });
    
  }
  openMainGridMadalView(data?: any) {
    if(data){
      this.dataToEditrow = []
      this.dataToEditrow.push(data)
    }else{
      this.dataToEditrow = []
    }
    this.modalService.open(this.add_scheme, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });
  }
  closeModal() {
    // this.activeModal.close();
    this.modalService.dismissAll()
  }
  // new rows added 
 
  addNewRow(data: any) {
    // if(data.SchemeUniqueNo && data.SchemeUniqueNo != ''){
    //   //if scheme is already saved 
    //   this.editSchemeDetail(data)
    //   return
    // }else{
    //   this.newSchemeItems = this.newSchemeItems.filter((item:any) => item.ID != data.ID)
    // }
    console.log(data,'data1');
    
    //if scheme is new 
    let params = {
      "ID": this.indexNumberStart += 1,
      "SCHEME_UNIQUEID": '',
      "SCHEME_ID": data.SchemeID || '',
      "SCHEME_UNITS": data.Units || 0,
      "SCHEME_TOTAL_VALUE": data.TotalValue || 0,
      "SCHEME_STARTED": new Date(data.StartDate).toISOString() || '',
      "SCHEME_ENDEDON": new Date (data.endDate).toISOString() || '',
      "SCHEME_STATUS": data.Status || "",
      "SCHEME_UNITVALUE": data.SchemeAmount || 0,
      "SCHEME_CUSTCODE": this.schemeRegistrationForm.value.Code || "",
      "sbranch_code": data.Branch || new Date(1/1/1753).toISOString(),
      "PCS_SYSTEM_DATE": new Date().toISOString(),
      "SalesManCode": data.Salesman || '',
      "AttachmentPath": '',
      "BANK_ACCOUNTNO": "",
      "BANK_IBANNO": "",
      "BANK_SWIFTID": "",
      "BANK_EMISTARTDATE": new Date().toISOString(),
      "BANK_EMIENDDATE": new Date().toISOString(),
      "ACTIVE": true,
      "SCHEME_REMARKS": '',
      "CUSTOMER_ACCOUNTNO": '',
      "BANK_DATE": new Date().toISOString(),
      "SCHEME_BLOCK": data.BlockScheme ? 1 : 0,
      "SCHEME_ControlRedeemDate": new Date().toISOString()
    }
    this.newSchemeItems.push(params)
    
    let datas = {
      "CustomerData": params,
      "ImageData": {
        "BRANCH_CODE": this.commonService.branchCode || "",
        "VOCTYPE": "PCR",
        "YEARMONTH": this.commonService.yearSelected,
        "VOCNO": 0
      },
      "Images": data.Attachedfile || []
    }
    this.detailArray.push(datas)
    this.closeModal()
  }
  editSchemeDetail(data: any) {
    
    let API = 'Scheme/SchemeMaster?SCHEME_UNIQUEID=' + data.SchemeUniqueNo
    let params = {
      "SCHEME_UNIQUEID": data.SchemeUniqueNo,
      "SCHEME_ID": data.SchemeID || '',
      "SCHEME_UNITS": data.Units || 0,
      "SCHEME_TOTAL_VALUE": data.TotalValue || 0,
      "SCHEME_STARTED": this.commonService.formatDate(data.StartDate) || '',
      "SCHEME_ENDEDON": this.commonService.formatDate(data.endDate) || '',
      "SCHEME_STATUS": data.Status || "",
      "SCHEME_UNITVALUE": 0,
      "SCHEME_CUSTCODE": data.SCHEME_CUSTCODE || "",
      "sbranch_code": data.Branch || '',
      "PCS_SYSTEM_DATE": new Date().toISOString(),
      "SalesManCode": data.Salesman || '',
      "AttachmentPath": '',
      "BANK_ACCOUNTNO": "",
      "BANK_IBANNO": "",
      "BANK_SWIFTID": "",
      "BANK_EMISTARTDATE": new Date().toISOString(),
      "BANK_EMIENDDATE": new Date().toISOString(),
      "ACTIVE": true,
      "SCHEME_REMARKS": '',
      "CUSTOMER_ACCOUNTNO": '',
      "BANK_DATE": new Date().toISOString(),
      "SCHEME_BLOCK": data.BlockScheme ? 1 : 0,
      "SCHEME_ControlRedeemDate": new Date().toISOString()
    }
    let Sub: Subscription = this.dataService.putDynamicAPI(API, params)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.closeModal()
          this.fetchSchemeWithCustCode(this.schemeRegistrationForm.value.Code)
          this.getSchemMasterGirdData()
          Swal.fire({
            title: result.status || 'updated',
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        } else {
          Swal.fire({
            title: 'branch Not Found!',
            text: "",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        }
      }, err => alert(err))

    this.subscriptions.push(Sub)
  }

  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openMadalView(str)
  }
  editMainGridDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openMainGridMadalView(str)
  }
  //USE delete row
  deleteRow(e: any) {
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
        let str = e.row.data;
        if(str.SCHEME_UNIQUEID == ''){
          let data = this.newSchemeItems.filter((item: any) => item.ID != str.ID)
          this.newSchemeItems = data
        }else{
          this.deleteSchemeWithUniqueId(str.SCHEME_UNIQUEID)
        }
      }
    })
  }
  deleteSchemeWithUniqueId(SCHEME_UNIQUEID: string){
    let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${SCHEME_UNIQUEID}`
    let Sub: Subscription = this.dataService.deleteDynamicAPI(API).subscribe((result) => {
      if (result.status == "Success") {
        this.fetchSchemeWithCustCode(this.schemeRegistrationForm.value.Code)
         Swal.fire({
          title: result.message || 'Scheme Deleted!',
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          // if (result.isConfirmed) {
          // }
        })
      } else {
        this.reset()
        // this.changeCode(event,searchFlag)
        Swal.fire({
          title: result.message || 'Scheme Not Deleted!',
          text: "try again",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          // if (result.isConfirmed) {
          // }
        })
      }
    }, err => alert(err))
    this.subscriptions.push(Sub)
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    this.snackBar.dismiss()
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
}
