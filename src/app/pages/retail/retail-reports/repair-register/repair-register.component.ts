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
  selector: 'app-repair-register',
  templateUrl: './repair-register.component.html',
  styleUrls: ['./repair-register.component.scss']
})
export class RepairRegisterComponent implements OnInit {

 
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  currentDate = new Date();
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

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCodeSelected(e: any) {
    console.log(e);
    this.repairRegisterForm.controls.partyCode.setValue(e.ACCODE);
  }

  repairRegisterForm: FormGroup = this.formBuilder.group({
    
    fromDate: [''],
    toDate: [''],
    partyCode: [''],
    partyName: [''],
    
  });

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {
  

    if (this.repairRegisterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = '/RptRepairRegister'
    let postData ={
      
      "strFromDate": this.repairRegisterForm.value.fromDate,
      "strToDate": this.repairRegisterForm.value.toDate,
      "strBrString": "",
      "strRepairType": 0,
      "strDiv": ""
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
                this.repairRegisterForm.reset()
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


}
