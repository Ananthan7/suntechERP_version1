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
  selector: 'app-enter-metal-details',
  templateUrl: './enter-metal-details.component.html',
  styleUrls: ['./enter-metal-details.component.scss']
})
export class EnterMetalDetailsComponent implements OnInit {
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];

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
  enterMetalDetailsForm: FormGroup = this.formBuilder.group({
    stockCodeDes: [''],
    stockCode: [''],
    karat: [''],
    rateType: [''],
  });

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(value: any) {
    console.log(value);
    this.enterMetalDetailsForm.controls.stockCode.setValue(value.STOCK_CODE);
    this.enterMetalDetailsForm.controls.stockCodeDes.setValue(value.DESCRIPTION);
  }

  karatcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatcodeSelected(value: any) {
    console.log(value);
    this.enterMetalDetailsForm.controls.karat.setValue(value.KARAT_CODE);
  }

  rateTypecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'Rate Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypecodeSelected(value: any) {
    console.log(value);
    this.enterMetalDetailsForm.controls.rateType.setValue(value.RATE_TYPE);
  }



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

    
  }
}
