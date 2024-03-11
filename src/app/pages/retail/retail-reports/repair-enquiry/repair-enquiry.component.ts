import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-repair-enquiry',
  templateUrl: './repair-enquiry.component.html',
  styleUrls: ['./repair-enquiry.component.scss']
})
export class RepairEnquiryComponent implements OnInit {
  @Input() content!: any;
  selectedTabIndex = 0;
  tableData: any = [];
  showHeaderFilter: boolean;
  showFilterRow: boolean;
  private subscriptions: Subscription[] = [];
  allMode: string;
  checkBoxesMode: string;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { 
    this.showHeaderFilter = true;
    this.showFilterRow = true;
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
  }

  repairEnquiryForm: FormGroup = this.formBuilder.group({
    
    enterSearch: [''],
    
  });

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit() {
  

    if (this.repairEnquiryForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = '/RptRepairEnquiryNet'
    let postData ={
      
      "strRepairType": 0,
      "strSearch": this.repairEnquiryForm.value.enterSearch,
      "strBranch": " "
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
                this.repairEnquiryForm.reset()
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
