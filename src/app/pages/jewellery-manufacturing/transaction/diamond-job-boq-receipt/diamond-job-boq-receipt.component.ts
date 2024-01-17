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
  selector: 'app-diamond-job-boq-receipt',
  templateUrl: './diamond-job-boq-receipt.component.html',
  styleUrls: ['./diamond-job-boq-receipt.component.scss']
})
export class DiamondJobBoqReceiptComponent implements OnInit {

  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();

  columnhead:any[] = ['SI.No','Design ID','Job Id','Order No','Pcs'];
  columnheadSummary:any[] = ['SI.No','Job No','Design ID','Div','Stock Id','Pcs','Gross.Wt','Color','Clarity','Shape','size','Slieve','Karat','So No','Job ID','unq Job Id','St.Wt','Net Wt','RateFc','RateLC','AmountFC','AmountLC','MetalStone','Purity','Pure.Wt','Broken Stone','Broken Stone','Broken Stock'];
  columnheadSummaryLabour:any[] = ['SI.No','Job ID','Process','Worker','Lab']
  columnheadJobDetails:any[] = ['SI.No','Job No','Design ID','Div','Stock Id','Pcs','Gross.Wt','Color','Clarity','Shape','size','Slieve','Karat','Broken Stone','Broken Stone','Broken Stock']
  columnheadSummaryLabourCharges:any[] = ['Select','SINo','Labour Code','Lab Accode','Division','Unit','Gross Wt','Pcs','Rate','Amount','GST Code','CGST %','CGST Amt','SGST %','SGST Amt','Total %','Total GST','Amount','Currency ']

  diamondJobBoqReceipt: FormGroup = this.formBuilder.group({
    vocDate:[new Date()],
    voctype:['JBR'],
    vocno:[1],
    enteredBy:[''],
    time:[''],
    karigger:[''],
    kariggerDesc:[''],
    currency:[''],
    currencyDesc:[''],
    baseCurrency:[''],
    baseCurrencyDesc:[''],
    grossWt:[''],
    jobNumber:[''],
    designId:[''],
    process:[''],
    worker:[''],
    labourchrg:[''],
    labourAC:[''],
    wastageWt:[''],

  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }

}
