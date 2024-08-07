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
  selector: 'app-producation-sub-details',
  templateUrl: './producation-sub-details.component.html',
  styleUrls: ['./producation-sub-details.component.scss']
})
export class ProducationSubDetailsComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  Data: any[] = [];
  divisionMS: any = 'ID';
  columnheads : any[] = ["S.no","Stock Code","Design","Cost","Karat","Gross Wt","M.Pcs","St.Wt","St.value","Labour","Wastage","Total Cost"];
  columnhead: any[] = ["Div","Pcs","Gross Wt"];
  labourColumnhead: any[] = ["Code","Div","Pcs","Qty","Rate","Amount","Wastage %","Wastage Qty","Wastage Amt","Lab A/C","Unit","Lab Type"];
  componentsColumnhead: any[] = ["Sr.No","Div","Stock Code","Color","Clarity","Shape","Size","Sileve","Pcs","Gross Wt","Stone","Net Wt","Rate","Amount","%","Qty","Amt","s.Rate","S.Value"];

  productionItemsDetailsFrom: FormGroup = this.formBuilder.group({
    stockCode  : [''],
    tagLines : [''],
    grossWt : [''],
    settingChrg : [''],
    settingChrgDesc : [''],
    polishChrg  :[''],
    polishChrgDesc  :[''],
    rhodiumChrg : [''],
    rhodiumChrgDesc : [''],
    labourChrg : [''],
    labourChrgDesc : [''],
    miscChrg : [''],
    miscChrgDesc : [''],
    metalValue : [''],
    stockValue : [''],
    totalLabour : [''],
    wastage : [''],
    wastageNo : [''],
    totalCoast : [''],
    price1per : [''],
    price1fc : [''],
    price1no : [''],
    price2per : [''],
    price2fc : [''],
    price2no : [''],
    price3per : [''],
    price3fc : [''],
    price3no : [''],
    price4per : [''],
    price4fc : [''],
    price4no : [''],
    price5per : [''],
    price5fc : [''],
    price5no : [''],
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

  }



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.productionItemsDetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "JobProductionMaster/InsertJobProductionMaster";
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_VOCNO": 0,
      "DT_VOCTYPE": "",
      "DT_VOCDATE": "2023-10-17T12:41:20.126Z",
      "DT_BRANCH_CODE": "",
      "DT_NAVSEQNO": "",
      "DT_YEARMONTH": "",
      "JOB_NUMBER": "",
      "JOB_DATE": "2023-10-17T12:41:20.126Z",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": "",
      "UNQ_DESIGN_ID": "",
      "DESIGN_CODE": "",
      "PART_CODE": "",
      "DIVCODE": "",
      "PREFIX": "",
      "STOCK_CODE": this.productionItemsDetailsFrom.value.stockCode,
      "STOCK_DESCRIPTION": "",
      "SET_REF": "",
      "KARAT_CODE": "",
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": this.productionItemsDetailsFrom.value.grossWt,
      "METAL_PCS": 0,
      "METAL_WT": 0,
      "STONE_PCS": 0,
      "STONE_WT": 0,
      "LOSS_WT": 0,
      "NET_WT": 0,
      "PURITY": 0,
      "PURE_WT": 0,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": "",
      "PROCESS_NAME": "",
      "WORKER_CODE": "",
      "WORKER_NAME": "",
      "IN_DATE": "2023-10-17T12:41:20.126Z",
      "OUT_DATE": "2023-10-17T12:41:20.126Z",
      "TIME_TAKEN_HRS": 0,
      "COST_CODE": "",
      "WIP_ACCODE": "",
      "STK_ACCODE": "",
      "SOH_ACCODE": "",
      "PROD_PROC": "",
      "METAL_DIVISION": this.productionItemsDetailsFrom.value.metalValue,
      "PRICE1PER": this.productionItemsDetailsFrom.value.price1per,
      "PRICE2PER": this.productionItemsDetailsFrom.value.price2per,
      "PRICE3PER": this.productionItemsDetailsFrom.value.price3per,
      "PRICE4PER": this.productionItemsDetailsFrom.value.price4per,
      "PRICE5PER": this.productionItemsDetailsFrom.value.price5per,
      "LOCTYPE_CODE": "",
      "WASTAGE_WT": this.productionItemsDetailsFrom.value.wastage,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "",
      "CUSTOMER_CODE": "",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "",
      "SUPPLIER_REF": this.productionItemsDetailsFrom.value.totalLabour,
      "TAGLINES": "",
      "SETTING_CHRG": this.productionItemsDetailsFrom.value.settingChrg,
      "POLISH_CHRG": this.productionItemsDetailsFrom.value.polishChrg,
      "RHODIUM_CHRG": this.productionItemsDetailsFrom.value.rhodiumChrg,
      "LABOUR_CHRG": this.productionItemsDetailsFrom.value.labourChrg,
      "MISC_CHRG": this.productionItemsDetailsFrom.value.miscChrg,
      "SETTING_ACCODE": this.productionItemsDetailsFrom.value.settingChrgDesc,
      "POLISH_ACCODE": this.productionItemsDetailsFrom.value.polishChrgDesc,
      "RHODIUM_ACCODE": this.productionItemsDetailsFrom.value.rhodiumChrgDesc,
      "LABOUR_ACCODE": this.productionItemsDetailsFrom.value.labourChrgDesc,
      "MISC_ACCODE": this.productionItemsDetailsFrom.value.miscChrgDesc,
      "WAST_ACCODE": this.productionItemsDetailsFrom.value.wastage,
      "REPAIRJOB": 0,
      "PRICE1FC": this.productionItemsDetailsFrom.value.price1fc,
      "PRICE2FC": this.productionItemsDetailsFrom.value.price2fc,
      "PRICE3FC": this.productionItemsDetailsFrom.value.price3fc,
      "PRICE4FC": this.productionItemsDetailsFrom.value.price4fc,
      "PRICE5FC": this.productionItemsDetailsFrom.value.price5fc,
      "BASE_CONV_RATE": 0,
      "FROM_STOCK_CODE": "",
      "TO_STOCK_CODE": "",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "",
      "LOTNUMBER": "",
      "TICKETNO": "",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": "",
      "BASE_CURR_RATE": 0
    }
    this.close(postData);
  }
  update() {
    if (this.productionItemsDetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API =
      "JobProductionMaster/UpdateJobProductionMaster/";
    let postData = {

    }
    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionItemsDetailsFrom.reset();
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

}
