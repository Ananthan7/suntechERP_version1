import { Input, OnInit, Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import themes from 'devextreme/ui/themes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-allowance-master',
  templateUrl: './allowance-master.component.html',
  styleUrls: ['./allowance-master.component.scss']
})
export class AllowanceMasterComponent implements OnInit {

  @ViewChild('overlayglcodeSearch') overlayglcodeSearch!: MasterSearchComponent;
  @ViewChild('overlaycountrycodeSearch') overlaycountrycodeSearch!: MasterSearchComponent;
  @ViewChild('overlayreport_headingSearch') overlayreport_headingSearch!: MasterSearchComponent;

  @Input() content!: any;
  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}
  private subscriptions: Subscription[] = [];
  credit_to_employeeAC:any;
  consider_for_overtime:any;
  avoid_fraction:any;
  leave_salary:any;
  viewMode: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  DBBranch: any = localStorage.getItem('userbranch')
  data:any;
  allowanceMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    description:[''],
    leave_salary:[0],
    glcode:[''],
    glcode_desc:[''],
    credit_to_employeeAC:[false],
    countrycode:[''],
    countrycodedesc:[''],
    consider_for_overtime:[false],
    calc_method:[''],
    value:[''],
    avoid_fraction:[0],
    report_heading:['0'],
    calc_basis:[''],
    period:[''],
    userdefined1:[''],
    userdefined2:[''],
    userdefined3:[''],
    userdefined4:[''],
    userdefined5:[''],
    userdefined6:[''],
    userdefined7:[''],
    userdefined8:[''],
    userdefined9:[''],
    userdefined10:[''],
    userdefined11:[''],
    userdefined12:[''],
    userdefined13:[''],
    userdefined14:[''],
    userdefined15:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.setFormValues();

    console.log(this.content)

    if (this.content?.FLAG) {
    
      if (this.content?.FLAG == 'VIEW') {
        this.viewMode = true;
      } else if (this.content?.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
       
      } else if (this.content?.FLAG == 'DELETE') {

        this.deleteallowance()
      }
    }
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  countryCodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.countrycode.setValue(e.CODE);
    this.allowanceMasterForm.controls.countrycodedesc.setValue(e.DESCRIPTION);
  }

  glCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'GL CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  glCodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.glcode.setValue(e.ACCODE);
    this.allowanceMasterForm.controls.glcode_desc.setValue(e.ACCOUNT_HEAD);
  }

  reportCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Report Heading',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  reportCodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.report_heading.setValue(e.CODE);
  }

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

  checkBoxValue(event:MatCheckboxChange, controller?:any){

    
    switch (controller) {
      case "credit_to_employeeAC":
        this.credit_to_employeeAC = event.checked
        break;

        case "consider_for_overtime":
          this.consider_for_overtime = event.checked
          break;
    
          case "avoid_fraction":
            this.avoid_fraction = event.checked
            break;

            case "leave_salary":
              this.leave_salary = event.checked
              break;
      default:
        break;
    }
    console.log(event.checked)
    
  }

  setFormValues() {
    if (!this.content) return;
    console.log(this.content.ALLMST_BASIS);
    console.log(this.DBBranch);
    let api ='AllowanceMaster/GetAllowanceMasterWithCode/'+this.content.ALLMST_CODE;
    console.log(api);
    let Sub: Subscription = this.dataService.getDynamicAPI(api).subscribe((result:any)=>{
      this.data = result.response;
      console.log(this.data);
      
    })
    this.allowanceMasterForm.controls.code.setValue(this.content.ALLMST_CODE)
    this.allowanceMasterForm.controls.description.setValue(this.content.ALLMST_DESC)
    this.allowanceMasterForm.controls.glcode.setValue(this.content.ALLMST_ACCODE)
    this.allowanceMasterForm.controls.value.setValue(this.content.ALLMST_AMOUNT)
    // this.allowanceMasterForm.controls.calc_method.setValue(this.content.ALLMST_PERCENFIXED);
    this.allowanceMasterForm.controls.calc_method.setValue(
      this.content.ALLMST_PERCENFIXED == 1 ? 1 : 0
    );
    this.allowanceMasterForm.controls.avoid_fraction.setValue(this.content.ALLMST_AVOIDFRACTION)
    this.allowanceMasterForm.controls.calc_basis.setValue(
      this.content.ALLMST_BASIS ? 1 : 0
  );
  
    this.allowanceMasterForm.controls.report_heading.setValue(this.content.ALLMST_REPORTHEADINGTO)
    this.allowanceMasterForm.controls.period.setValue(this.content.ALLMST_YEARMONTHLY)
    this.allowanceMasterForm.controls.credit_to_employeeAC.setValue(this.content.ALLMST_CREDIT_EMPAC)
    this.allowanceMasterForm.controls.leave_salary.setValue(this.content.ALLMST_LS)
    this.allowanceMasterForm.controls.countrycode.setValue(this.content.ALLMSTCOUNTRYCODE)
    this.allowanceMasterForm.controls.userdefined1.setValue(this.content.UDF1)
    this.allowanceMasterForm.controls.userdefined2.setValue(this.content.UDF2)
    this.allowanceMasterForm.controls.userdefined3.setValue(this.content.UDF3)
    this.allowanceMasterForm.controls.userdefined4.setValue(this.content.UDF4)
    this.allowanceMasterForm.controls.userdefined5.setValue(this.content.UDF5)
    this.allowanceMasterForm.controls.userdefined6.setValue(this.content.UDF6)
    this.allowanceMasterForm.controls.userdefined7.setValue(this.content.UDF7)
    this.allowanceMasterForm.controls.userdefined8.setValue(this.content.UDF8)
    this.allowanceMasterForm.controls.userdefined9.setValue(this.content.UDF9)
    this.allowanceMasterForm.controls.userdefined10.setValue(this.content.UDF10)
    this.allowanceMasterForm.controls.userdefined11.setValue(this.content.UDF11)
    this.allowanceMasterForm.controls.userdefined12.setValue(this.content.UDF12)
    this.allowanceMasterForm.controls.userdefined13.setValue(this.content.UDF13)
    this.allowanceMasterForm.controls.userdefined14.setValue(this.content.UDF14)
    this.allowanceMasterForm.controls.userdefined15.setValue(this.content.UDF15)
    this.allowanceMasterForm.controls.consider_for_overtime.setValue(this.data.ALLMST_OVT)
  }


  postData(){
   return{
      "MID": 0,
      "ALLMST_CODE": this.allowanceMasterForm.value.code,
      "ALLMST_DESC": this.allowanceMasterForm.value.description,
      "ALLMST_ACCODE": this.allowanceMasterForm.value.glcode,
      "ALLMST_AMOUNT":  this.allowanceMasterForm.value.value,
      "ALLMST_PERCENFIXED": this.allowanceMasterForm.value.calc_method,
      "ALLMST_AVOIDFRACTION": this.avoid_fraction == true ? 1 : 0,
      "ALLMST_BASIS":  this.allowanceMasterForm.value.calc_basis,
      // "ALLMST_REPORTHEADINGTO": this.allowanceMasterForm.value.report_heading,
      "ALLMST_REPORTHEADINGTO":0,
      "ALLMST_YEARMONTHLY": this.allowanceMasterForm.value.period,
      "ALLMST_CREDIT_EMPAC": this.credit_to_employeeAC,
      "ALLMST_LS":  this.leave_salary == true ? 1 : 0,
      "ALLMSTCOUNTRYCODE": this.allowanceMasterForm.value.countrycode,
      "UDF1": this.allowanceMasterForm.value.userdefined1,
      "UDF2": this.allowanceMasterForm.value.userdefined2,
      "UDF3": this.allowanceMasterForm.value.userdefined3,
      "UDF4": this.allowanceMasterForm.value.userdefined4,
      "UDF5": this.allowanceMasterForm.value.userdefined5,
      "UDF6": this.allowanceMasterForm.value.userdefined6,
      "UDF7": this.allowanceMasterForm.value.userdefined7,
      "UDF8": this.allowanceMasterForm.value.userdefined8,
      "UDF9": this.allowanceMasterForm.value.userdefined9,
      "UDF10": this.allowanceMasterForm.value.userdefined10,
      "UDF11": this.allowanceMasterForm.value.userdefined11,
      "UDF12": this.allowanceMasterForm.value.userdefined12,
      "UDF13": this.allowanceMasterForm.value.userdefined13,
      "UDF14": this.allowanceMasterForm.value.userdefined14,
      "UDF15": this.allowanceMasterForm.value.userdefined15,
      "ALLMST_OVT": this.allowanceMasterForm.value.consider_for_overtime
      };
  
  }
  formSubmit(){
    // if (this.content && this.content.FLAG == 'VIEW') return
    // if(this.content && this.content.FLAG == 'EDIT'){
    //   this.update()
    //   return
    // }
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }


    console.log(this.postData);

    let API = 'AllowanceMaster/InsertAllowanceMaster';
    let postData = this.postData()
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
              this.allowanceMasterForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);
  
    
  }

  update(){

    let API = 'AllowanceMaster/UpdateAllowanceMaster/'+ this.allowanceMasterForm.value.code;
    let postData = this.postData()
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
              this.allowanceMasterForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);
  
  }

  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  afterSave(value: any) {
    this.allowanceMasterForm.reset()
    this.tableData = []
    this.close('reloadMainGrid')
  }

  deleteallowance(){
    if (this.content && this.content.FLAG == 'VIEW') return
    // if (!this.content.WORKER_CODE) {
    //   this.showDeleteErrorDialog('Please Select data to delete!');
    //   return;
    // }

    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = 'AllowanceMaster/DeleteAllowanceMaster/' +  this.allowanceMasterForm.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog(result.message || 'Success');
              } else {
                this.showErrorDialog(result.message || 'Error please try again');
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => {
            this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          });
        this.subscriptions.push(Sub);
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
          this.allowanceMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    }

  BranchDataSelected(e:any){

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
      case 'glcode':
        this.overlayglcodeSearch.showOverlayPanel(event);
        break;
      case 'countrycode':
        this.overlaycountrycodeSearch.showOverlayPanel(event);
        break;
      case 'report_heading':
        this.overlayreport_headingSearch.showOverlayPanel(event);
        break;
      default:
    }
  }

  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'glcode':
        this.overlayglcodeSearch.showOverlayPanel(event);
        break;
      case 'countrycode':
        this.overlaycountrycodeSearch.showOverlayPanel(event);
        break;
      case 'report_heading':
        this.overlayreport_headingSearch.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

  UDF1Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF1',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF1CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined1.setValue(e.CODE);
  }

  UDF2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF1',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF2CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined2.setValue(e.CODE);
  }
  
  UDF3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF3',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF3CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined3.setValue(e.CODE);
  }

  
  UDF4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF4',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF4CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined4.setValue(e.CODE);
  }
    
  UDF5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF5',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF5CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined5.setValue(e.CODE);
  }
      
  UDF6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF6',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF6CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined6.setValue(e.CODE);
  }
        
  UDF7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF6',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF7CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined7.setValue(e.CODE);
  }
        
  UDF8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF8',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF8CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined8.setValue(e.CODE);
  }
          
  UDF9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF9',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF9CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined9.setValue(e.CODE);
  }

            
  UDF10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF10',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF10CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined10.setValue(e.CODE);
  }
              
  UDF11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF11',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF11CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined11.setValue(e.CODE);
  }
                
  UDF12Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF12',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF12CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined12.setValue(e.CODE);
  }
                  
  UDF13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF13',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF13CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined13.setValue(e.CODE);
  }
                    
  UDF14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF14',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF14CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined14.setValue(e.CODE);
  }
                      
  UDF15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'UDF15',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  UDF15CodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.userdefined15.setValue(e.CODE);
  }
}
