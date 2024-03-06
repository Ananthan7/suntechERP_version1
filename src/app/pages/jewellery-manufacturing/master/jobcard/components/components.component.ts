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
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss']
})
export class ComponentsComponent implements OnInit {
  selectedTabIndex = 0;
  tableDataProcess: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'SequenceMasterDJ/GetSequenceMasterDJDetail/';
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

  close(data?: any) {
    this.activeModal.close(data);
  }


}
