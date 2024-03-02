import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-sales-dia-details-i-gst-ind',
  templateUrl: './pos-sales-dia-details-i-gst-ind.component.html',
  styleUrls: ['./pos-sales-dia-details-i-gst-ind.component.scss']
})
export class PosSalesDiaDetailsIGSTIndComponent implements OnInit {

  @Input() content!: any;
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  tableData: any[] = [];
  viewMode:boolean = false;
  private subscriptions: Subscription[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;


  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }

}
