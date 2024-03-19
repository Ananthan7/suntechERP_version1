import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-design-sequence',
  templateUrl: './design-sequence.component.html',
  styleUrls: ['./design-sequence.component.scss']
})
export class DesignSequenceComponent implements OnInit {

  tableDataProcess: any[] = [];

  columnhead: any[] = ['SRNO', 'PROCESS_CODE', 'POINTS', 'STD_LOSS', 'MAX_LOSS', 'STD_TIME', 'LOSS_ACCODE', 'WIP_ACCODE', 'TIMEON_PROCESS']
  designSequenceForm: FormGroup = this.formBuilder.group({
    processCode: [''],
    processDesc: [''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    let secCode = this.designSequenceForm.value.processCode;

    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'SequenceMasterDJ/GetSequenceMasterDJList';
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe(
        (result) => {
          if (result.status === 'Success' && result.response) {
            this.tableDataProcess = result.response.map((item: any, index: number) => {
              return { ...item, SELECT1: false, SRNO: index + 1 };
            });
            console.log(this.tableDataProcess);
          } else {
            this.commonService.toastErrorByMsgId('MSG1531');
          }
        },
        err => {
          console.error('Error fetching data:', err);
          this.commonService.toastErrorByMsgId('MSG1531');
        }
      );
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 93,
    SEARCH_FIELD: 'SEQ_CODE',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SEQ_CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processCodeSelected(e: any) {
    console.log(e);
    this.designSequenceForm.controls.processCode.setValue(e.SEQ_CODE);
    this.designSequenceForm.controls.processDesc.setValue(e.DESCRIPTION);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

  }

  deleteRecord() {

  }

  sequenceSearch() {

    let secCode = this.designSequenceForm.value.processCode;

    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'SequenceMasterDJ/GetSequenceMasterDJDetail/' + secCode;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe(
        (result) => {
          if (result.status === 'Success' && result.response.sequenceDetails) {
            this.tableDataProcess = result.response.sequenceDetails.map((item: any, index: number) => {
              return { ...item, SELECT1: false, SRNO: index + 1 };
            });
            console.log(this.tableDataProcess);
          } else {
            this.commonService.toastErrorByMsgId('MSG1531');
          }
        },
        err => {
          console.error('Error fetching data:', err);
          this.commonService.toastErrorByMsgId('MSG1531');
        }
      );

  }
}
