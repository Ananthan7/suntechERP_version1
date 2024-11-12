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

@Component({
  selector: 'app-allowance-master',
  templateUrl: './allowance-master.component.html',
  styleUrls: ['./allowance-master.component.scss']
})
export class AllowanceMasterComponent implements OnInit {

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

    if (this.content?.FLAG) {
    
      if (this.content?.FLAG == 'VIEW') {
       
      } else if (this.content?.FLAG == 'EDIT') {
       
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
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'GL CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  glCodeSelected(e:any){
    console.log(e);
    this.allowanceMasterForm.controls.glcode.setValue(e.CODE);
    this.allowanceMasterForm.controls.glcode_desc.setValue(e.DESCRIPTION);
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
    //TODO reset forms and data before closing
    this.activeModal.close(data);
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
    this.allowanceMasterForm.controls.code.setValue(this.content.ALLMST_CODE)
    this.allowanceMasterForm.controls.description.setValue(this.content.ALLMST_DESC)
    this.allowanceMasterForm.controls.glcode.setValue(this.content.ALLMST_ACCODE)
    this.allowanceMasterForm.controls.value.setValue(this.content.ALLMST_AMOUNT)
    this.allowanceMasterForm.controls.calc_method.setValue(this.content.ALLMST_PERCENFIXED)
    this.allowanceMasterForm.controls.avoid_fraction.setValue(this.content.ALLMST_AVOIDFRACTION)
    this.allowanceMasterForm.controls.calc_basis.setValue(this.content.ALLMST_BASIS)
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
    this.allowanceMasterForm.controls.consider_for_overtime.setValue(this.content.ALLMST_OVT)
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
      "ALLMST_REPORTHEADINGTO": this.allowanceMasterForm.value.report_heading,
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
      "ALLMST_OVT": this.consider_for_overtime
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

  BranchDataSelected(e:any){

  }
}
