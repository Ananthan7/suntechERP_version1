import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producation-loss-recovery',
  templateUrl: './producation-loss-recovery.component.html',
  styleUrls: ['./producation-loss-recovery.component.scss']
})
export class ProducationLossRecoveryComponent implements OnInit {

  currentDate = new Date();
  columnhead:any= ['Srno','Type','Worker Code','Process Code','Scrap Gross Wt','Scrap Pure Wt','Location To','Job Number','Job So Number','Design Code','Scrap UNQ Job'];
  columHederMain:any = ['Srno','Worker code','Process Code','Job Number','Balance','Bal.pure','Remaining','Trans','Vocno','JobNumber','Job S','Design','Pcs','Loss Bo'];
  selectedReturnType: string = 'Gold';
  viewMode: boolean = false;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { }


  ngOnInit(): void {

  }

  productionlossrecoveryForm: FormGroup = this.formBuilder.group({
    worker: [""],
    process: [""],
    Metalsoption: ["D"],

  });

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Salesman Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerCodeSelected(e: any) {
    console.log(e);
    this.productionlossrecoveryForm.controls.worker.setValue(e.WORKER_CODE);
    
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
   processCodeSelected(e: any) {
    console.log(e);
    this.productionlossrecoveryForm.controls.process.setValue(e.Process_Code);
    
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
