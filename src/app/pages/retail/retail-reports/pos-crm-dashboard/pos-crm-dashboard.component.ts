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
  selector: 'app-pos-crm-dashboard',
  templateUrl: './pos-crm-dashboard.component.html',
  styleUrls: ['./pos-crm-dashboard.component.scss']
})
export class PosCrmDashboardComponent implements OnInit {
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

 posCRMdasbordFrom: FormGroup = this.formBuilder.group({
  festival: ['',[Validators.required]],
  daterange: ['',[Validators.required]],
  division: ['',[Validators.required]],
  metal: ['',[Validators.required]],
  diamondsection: ['',[Validators.required]],
  });

  ngOnInit(
    
  ): void {
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.posCRMdasbordFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'UspSuggestNewDIaJewCRMDBoard'
    let postData = {

      "str_FilterField": "string",
      "str_FilterValues": "string",
      "str_PriceField": "string",
      "str_PriceFm": "string",
      "str_PriceTo": "string"
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
                this.posCRMdasbordFrom.reset()
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
