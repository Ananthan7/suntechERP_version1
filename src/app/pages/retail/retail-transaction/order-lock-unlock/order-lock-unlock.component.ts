import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-lock-unlock',
  templateUrl: './order-lock-unlock.component.html',
  styleUrls: ['./order-lock-unlock.component.scss']
})
export class OrderLockUnlockComponent implements OnInit {

  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];

  columnhead:any[] = ['NO','BRANCH' ,'VOCTYPE' , 'VOCNO','VOCDATE','YEAR','SALESMAN','PARTY NAME','REMARKS','ORDER AMOUNT'];
  branchCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  orderlockandunlockForm: FormGroup = this.formBuilder.group({
    branch: [''],
    order_code: [''],
    order_no: [''],
    order_age: [''],
    fromdate: [''],
    todate: ['']
  });


  formSubmit() {
    
    if (this.orderlockandunlockForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'UspGetLockUnLockSalesOrders'
    let postData = {
      "strBranches": "",
      "strDays": "",
      "strFrDate": "",
      "strToDate": "",
      "LockUnlock": true,
      "strLoginUser": "",
      "strVoctype": "",
      "Vocno": 0,
      "strYearMonth": ""
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.orderlockandunlockForm.reset()
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
  lockClicked(){}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
