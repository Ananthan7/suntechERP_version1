import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validation-splist',
  templateUrl: './validation-splist.component.html',
  styleUrls: ['./validation-splist.component.scss']
})
export class ValidationSplistComponent implements OnInit {
  getDate: any = new Date();
  isLoading: boolean = false;
  saveEditFlag: boolean = false;
  isViewForm: boolean = false;
  /** form validations */
  // dataForm = this.fb.group({
  //   USERNAME: ['', [Validators.required]],
  //   PASSWORD: ['', [Validators.required]],
  // })

  subscriptions$: Subscription[] = [];
  tableData: any[] = [];

  ModuleNameDataSource: any[] = [
    { MODULE_NAME: "Bullion" },
    { MODULE_NAME: "Diamond Wholesale" },
    { MODULE_NAME: "Refinery" },
    { MODULE_NAME: "Diamond Manufacturing" },
    { MODULE_NAME: "Metal Manufacturing" },
    { MODULE_NAME: "Component Wise Diamond" },
    { MODULE_NAME: "Metal Wholesale" },
    { MODULE_NAME: "Payroll and HR" },
    { MODULE_NAME: "Boiling" },
    { MODULE_NAME: "Repairing" },
    { MODULE_NAME: "Catalogue" },
    { MODULE_NAME: "Fixed Asset" },
    { MODULE_NAME: "Retail" },
    { MODULE_NAME: "General" }
  ];
  ModuleTypeDataSource: any[] = [
    { MODULE_TYPE: "MASTER" },
    { MODULE_TYPE: "TRANSACTION" },
    { MODULE_TYPE: "REPORT" },
  ];
  constructor(
    private fb: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,

  ) {
    this.getValidationSPList()
  }
  ngOnInit(): void {
  }

  getValidationSPList() {
    let API = 'ValidationsLookUpMaster/GetValidationsLookUpMasterHeaderList'
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.isLoading = false;
        console.log(result);
        if (result.status == 'Success') {
          this.tableData = result.response
        }
      })
    this.subscriptions$.push(Sub)
  }
  logEvent(event: any) {
    console.log(event, 'e');
  }
  onSaving(e: any) {
    let data: any = e.data;
    if (!data.SP_ID) {
      this.toastr.error('Server Error', '', {
        timeOut: 3000,
      })
      return
    }
    let postData = {
      "MID": 0,
      "SP_ID": data.SP_ID || "",
      "SP_NAME": data.SP_NAME || "",
      "MODULE_NAME": data.MODULE_NAME || "",
      "FORM_NAME": data.FORM_NAME || "",
      "DB_NAME": data.DB_NAME || "",
      "MODULE_TYPE": data.MODULE_TYPE || "",
      "LASTUPDATEDON": new Date().toISOString(),
      "TABLE_NAME": data.TABLE_NAME || ""
    }
    this.isLoading = true;
    let API = `ValidationsLookUpMaster/InsertValidationsLookUpMaster`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result: any) => {
        this.isLoading = false;
        console.log(result);
        if (result.status == 'Success') {
          this.getValidationSPList()
          this.toastr.success(result.status || '', result.message || '', {
            timeOut: 3000,
          })
        } else {
          this.getValidationSPList()
          this.toastr.error(result.status || '', result.message || '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.isLoading = false;
        this.getValidationSPList()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
      this.subscriptions$.push(Sub)
  }

  /**use: update data in table */
  updateData(e: any) {
    let data: any = e.data;
    this.isLoading = true;

    let postData = {
      "MID": 0,
      "SP_ID": data.SP_ID || "",
      "SP_NAME": data.SP_NAME || "",
      "MODULE_NAME": data.MODULE_NAME || "",
      "FORM_NAME": data.FORM_NAME || "",
      "DB_NAME": data.DB_NAME || "",
      "MODULE_TYPE": data.MODULE_TYPE || "",
      "LASTUPDATEDON": new Date().toISOString(),
      "TABLE_NAME": data.TABLE_NAME || ""
    }
    let API = `ValidationsLookUpMaster/UpdateValidationsLookUpMaster/${data.MID}`
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result: any) => {
        this.isLoading = false;
        console.log(result);
        if (result.status == 'Success') {
          this.getValidationSPList()
          this.toastr.success(result.status || '', result.message || '', {
            timeOut: 3000,
          })
        } else {
          this.getValidationSPList()
          this.toastr.error(result.status || '', result.message || '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.getValidationSPList()
        this.isLoading = false;
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
      this.subscriptions$.push(Sub)
  }
  /**use: update data in table */
  deleteData(e: any) {
    let data: any = e.data;
    this.isLoading = true;
    let API = `ValidationsLookUpMaster/DeleteValidationsLookUpMaster/${data.MID}`
    let Sub: Subscription = this.dataService.deleteDynamicAPI(API, data)
      .subscribe((result: any) => {
        this.isLoading = false;
        console.log(result);
        if (result.status == 'Success') {
          this.toastr.success(result.status || '', result.message || '', {
            timeOut: 3000,
          })
        } else {
          this.toastr.error(result.status || '', result.message || '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.isLoading = false;
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
      this.subscriptions$.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions$.length > 0) {
      this.subscriptions$.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions$ = []; // Clear the array
    }
  }

}
