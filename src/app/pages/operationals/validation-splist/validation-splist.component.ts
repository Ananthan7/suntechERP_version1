import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validation-splist',
  templateUrl: './validation-splist.component.html',
  styleUrls: ['./validation-splist.component.scss']
})
export class ValidationSplistComponent implements OnInit {
  groupList: any[] = []
  userList: any[] = []
  branchList: any[] = []
  ReportFilterList: any[] = []
  getDate: any = new Date();
  placeholder: string = 'select branch'
  isLoading: boolean = false;
  saveEditFlag: boolean = false;
  isViewForm: boolean = false;
  model: any = {}
  selectedCategories: any[] = []
  /** form validations */
  dataForm = this.fb.group({
    USERNAME: ['', [Validators.required]],
    PASSWORD: ['', [Validators.required]],
  })
  currency: any[] = [];
  language: any[] = [];
  stateDataSource: any[] = [
    { Name: 'MOD', ID: 1 },
    { Name: 'Last 5 years', ID: 2 },
  ];
  constructor(
    private fb: FormBuilder
  ) { 
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.deleteModule = this.deleteModule.bind(this);
  }

  ngOnInit(): void {
  }
  logEvent(eventName:any) {
    console.log(eventName,'eventName');
    
  }

  saveData() {
    if (this.dataForm.invalid) {
      Swal.fire({
        title: 'Warning',
        text: 'Please fill all mandatory fields marked',
        icon: 'warning',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      })
    } else {
      let data = {
        "MID": 0,
        "USER_NAME": this.dataForm.value.USERNAME || '',
        "LOGIN_PASSWORD": this.dataForm.value.PASSWORD || '',
        "USER_LANGUAGE": this.dataForm.value.LANGUAGE.toString() || '',
        "SYSTEM_DATE": new Date().toISOString,
        "LOGINSTARTYEAR": this.getDate.getFullYear().toString(),
        "GROUP_ID": this.dataForm.value.GROUP.toString() || '',
        "GROUP_NAME": this.dataForm.value.GROUP.toString() || '',
        "USER_IS_ACTIVE": this.dataForm.value.Status || '',
        "BRANCH_CODE": this.dataForm.value.BRANCH.toString() || '',
        "CURRENCY": this.dataForm.value.CURRENCY.toString() || '',
        "PRODUCT_ATTRIBUTES": this.dataForm.value.PRODUCT_ATTRIBUTES.toString() || '',
        "FILTERS": this.dataForm.value.FILTERS.toString() || '',
        "TIME_PERIOD_ACCESS": this.dataForm.value.TIME_PERIOD_ACCESS || '5'
      }
      this.isLoading = true;
      
    }

  }
  deleteModule(e: any) {
   
  }
  viewRowDetails(e: any) {
   
  }
}
