import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-loyalty-register',
  templateUrl: './loyalty-register.component.html',
  styleUrls: ['./loyalty-register.component.scss']
})
export class LoyaltyRegisterComponent implements OnInit {

  // subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  isReadOnly:boolean=true;
  vocMaxDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  loyaltyregisterFrom: FormGroup = this.formBuilder.group({
    branch: ['',[Validators.required]],
    customerfrom: ['',[Validators.required]],
    customerto: ['',[Validators.required]],
    fromdate: ['',[Validators.required]],
    todate: ['',[Validators.required]],
    reportto: [''],
    pointsfrom: ['',[Validators.required]],
    pointsto: ['',[Validators.required]],
  });


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.loyaltyregisterFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'RptLoyaltyRegisterCurrencyNet'
    let postData = {

      "strFromDate": this.loyaltyregisterFrom.value.fromdate,
      "strToDate": this.loyaltyregisterFrom.value.todate,
      "strCustcodeFrom": this.loyaltyregisterFrom.value.voctype,
      "strCustcodeTo":this.loyaltyregisterFrom.value.voctype,
      "strPointsFrom": this.loyaltyregisterFrom.value.voctype,
      "strPointsTo": this.loyaltyregisterFrom.value.voctype,
      "strBranches": this.loyaltyregisterFrom.value.branch,
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
                this.loyaltyregisterFrom.reset()
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

 

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }


}
