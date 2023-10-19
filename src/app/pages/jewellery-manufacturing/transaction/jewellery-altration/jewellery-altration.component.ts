import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JewelleryAltrationDetailsComponent } from './jewellery-altration-details/jewellery-altration-details.component';

@Component({
  selector: 'app-jewellery-altration',
  templateUrl: './jewellery-altration.component.html',
  styleUrls: ['./jewellery-altration.component.scss']
})
export class JewelleryAltrationComponent implements OnInit {

  columnhead:any[] = ['SrNo','Stock Code','Description', 'Pcs','Metal/','Stone ','Gross','Cost (OLD)','Cost (New)','Remark'];
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  private subscriptions: Subscription[] = [];
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  userDataSelected(value: any) {
    console.log(value);
       this.jewelleryaltrationFrom.controls.userName.setValue(value.UsersName);
  }
  costCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCodeSelected(e:any){
    console.log(e);
    this.jewelleryaltrationFrom.controls.stockcode.setValue(e.COST_CODE);
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
    this.branchCode = this.comService.branchCode;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  jewelleryaltrationFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
   vocdate:[''],
   metalrate:[''],
   metalratetype:[''],
   costcode:[''],
   lossaccount:[''],
   enteredby:[''],
   itemcurrency:[''],
   itemcurrencycc:[''],
    narration:[''],
  });


  openjewelleryaltrationdetails() {
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAltrationDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": "str",
      "VOCNO": 0,
      "VOCDATE": "2023-10-14T08:59:56.964Z",
      "YEARMONTH": "string",
      "SMAN": "string",
      "LOSS_ACCODE": "string",
      "CURRENCY_CODE": "stri",
      "CC_RATE": 0,
      "MET_RATE_TYPE": "string",
      "METAL_RATE": 0,
      "NAVSEQNO": 0,
      "TOTALPCS": 0,
      "TOTAL_LAB_CHARGECC": 0,
      "TOTAL_LAB_CHARGEFC": 0,
      "TOTAL_COST_OLDCC": 0,
      "TOTAL_COST_OLDFC": 0,
      "TOTAL_COST_NEWCC": 0,
      "TOTAL_COST_NEWFC": 0,
      "REMARKS": "string",
      "PRINT_COUNT": 0,
      "POSTDATE": "string",
      "AUTOPOSTING": true,
      "HTUSERNAME": "string",
      "REMARKS_DETAIL": "string",
      "GENSEQNO": 0,
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "string",
      "DESCRIPTION": "string",
      "PCS": 0,
      "COSTFC": 0,
      "COSTCC": 0,
      "COSTFCNEW": 0,
      "COSTCCNEW": 0,
      "METALWT": 0,
      "PUREWT": 0,
      "STONEWT": 0,
      "GROSSWT": 0,
      "METAL_AMTFC": 0,
      "METAL_AMTCC": 0,
      "STONE_AMTFC": 0,
      "STONE_AMTCC": 0,
      "METALWT_NEW": 0,
      "PUREWT_NEW": 0,
      "STONEWT_NEW": 0,
      "GROSSWT_NEW": 0,
      "METAL_AMTFCNEW": 0,
      "METAL_AMTCCNEW": 0,
      "STONE_AMTFCNEW": 0,
      "STONE_AMTCCNEW": 0,
      "SET_ACCODE": "string",
      "SET_AMTFC": 0,
      "SET_AMTCC": 0,
      "SET_AMTFCNEW": 0,
      "SET_AMTCCNEW": 0,
      "POL_ACCODE": "string",
      "POL_AMTFC": 0,
      "POL_AMTCC": 0,
      "POL_AMTFCNEW": 0,
      "POL_AMTCCNEW": 0,
      "RHO_ACCODE": "string",
      "RHO_AMTFC": 0,
      "RHO_AMTCC": 0,
      "RHO_AMTFCNEW": 0,
      "RHO_AMTCCNEW": 0,
      "MKG_ACCODE": "string",
      "MKG_AMTFC": 0,
      "MKG_AMTCC": 0,
      "MKG_AMTFCNEW": 0,
      "MKG_AMTCCNEW": 0,
      "MIS_ACCODE": "string",
      "MIS_AMTFC": 0,
      "MIS_AMTCC": 0,
      "MIS_AMTFCNEW": 0,
      "MIS_AMTCCNEW": 0,
      "TOTALLAB_AMTFC": 0,
      "TOTALLAB_AMTCC": 0,
      "TOTALLAB_AMTFCNEW": 0,
      "TOTALLAB_AMTCCNEW": 0,
      "MFGVOC_REF": "string",
      "MFGVOC_DATE": "2023-10-14T08:59:56.964Z",
      "COST_CODE": "string",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "string",
      "PRICE2PER": "string",
      "PRICE3PER": "string",
      "PRICE4PER": "string",
      "PRICE5PER": "string",
      "PRICE1FC": 0,
      "PRICE1LC": 0,
      "PRICE2FC": 0,
      "PRICE2LC": 0,
      "PRICE3FC": 0,
      "PRICE3LC": 0,
      "PRICE4FC": 0,
      "PRICE4LC": 0,
      "PRICE5FC": 0,
      "PRICE5LC": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "PLAT_ACCODE": "string",
      "CERT_ACCODE": "string",
      "PLAT_CHARGESFC": 0,
      "PLAT_CHARGESCC": 0,
      "CERT_CHARGESFC": 0,
      "CERT_CHARGESCC": 0,
      "PLAT_CHARGESFCNEW": 0,
      "PLAT_CHARGESCCNEW": 0,
      "CERT_CHARGESFCNEW": 0,
      "CERT_CHARGESCCNEW": 0,
      "COLOR": "string",
      "TAG_LINES": "string",
      "REFMID": 0,
      "MAINCODE": "string",
      "SLNO": 0,
      "METALSTONE": "s",
      "DIVISION": "s",
      "DET_STOCK_CODE": "string",
      "RET_STOCK_CODE": "string",
      "KARAT_CODE": "stri",
      "PURITY": 0,
      "WEIGHT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "AMOUNTFC": 0,
      "AMOUNTCC": 0,
      "REMOVED": 0,
      "NEWENTRY": 0,
      "LOC_TYPE": "string",
      "SHAPE": "string",
      "SIEVE": "string",
      "STONE_TYPE": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "SIEVE_SET": "string"
    };
    this.tableData.push(data);
}
removedata(){
  this.tableData.pop();
}
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.jewelleryaltrationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DiamondJewelAlteration/InsertDiamondJewelAlteration'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jewelleryaltrationFrom.value.voctype || "",
      "VOCNO": this.jewelleryaltrationFrom.value.vocno || "",
      "VOCDATE": this.jewelleryaltrationFrom.value.vocdate || "",
      "YEARMONTH": "string",
      "SMAN": "string",
      "LOSS_ACCODE": this.jewelleryaltrationFrom.value.lossaccount || "",
      "CURRENCY_CODE": this.jewelleryaltrationFrom.value.itemcurrency || "",
      "CC_RATE": this.jewelleryaltrationFrom.value.itemcurrencycc || "",
      "MET_RATE_TYPE": this.jewelleryaltrationFrom.value.metalratetype || "",
      "METAL_RATE": this.jewelleryaltrationFrom.value.metalrate || "",
      "NAVSEQNO": 0,
      "TOTALPCS": 0,
      "TOTAL_LAB_CHARGECC": 0,
      "TOTAL_LAB_CHARGEFC": 0,
      "TOTAL_COST_OLDCC": 0,
      "TOTAL_COST_OLDFC": 0,
      "TOTAL_COST_NEWCC": 0,
      "TOTAL_COST_NEWFC": 0,
      "REMARKS": this.jewelleryaltrationFrom.value.narration || "",
      "PRINT_COUNT": 0,
      "POSTDATE": "string",
      "AUTOPOSTING": true,
      "HTUSERNAME": "string",
      "REMARKS_DETAIL": "string",
      "GENSEQNO": 0,
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "string",
      "DESCRIPTION": "string",
      "PCS": 0,
      "COSTFC": 0,
      "COSTCC": 0,
      "COSTFCNEW": 0,
      "COSTCCNEW": 0,
      "METALWT": 0,
      "PUREWT": 0,
      "STONEWT": 0,
      "GROSSWT": 0,
      "METAL_AMTFC": 0,
      "METAL_AMTCC": 0,
      "STONE_AMTFC": 0,
      "STONE_AMTCC": 0,
      "METALWT_NEW": 0,
      "PUREWT_NEW": 0,
      "STONEWT_NEW": 0,
      "GROSSWT_NEW": 0,
      "METAL_AMTFCNEW": 0,
      "METAL_AMTCCNEW": 0,
      "STONE_AMTFCNEW": 0,
      "STONE_AMTCCNEW": 0,
      "SET_ACCODE": "string",
      "SET_AMTFC": 0,
      "SET_AMTCC": 0,
      "SET_AMTFCNEW": 0,
      "SET_AMTCCNEW": 0,
      "POL_ACCODE": "string",
      "POL_AMTFC": 0,
      "POL_AMTCC": 0,
      "POL_AMTFCNEW": 0,
      "POL_AMTCCNEW": 0,
      "RHO_ACCODE": "string",
      "RHO_AMTFC": 0,
      "RHO_AMTCC": 0,
      "RHO_AMTFCNEW": 0,
      "RHO_AMTCCNEW": 0,
      "MKG_ACCODE": "string",
      "MKG_AMTFC": 0,
      "MKG_AMTCC": 0,
      "MKG_AMTFCNEW": 0,
      "MKG_AMTCCNEW": 0,
      "MIS_ACCODE": "string",
      "MIS_AMTFC": 0,
      "MIS_AMTCC": 0,
      "MIS_AMTFCNEW": 0,
      "MIS_AMTCCNEW": 0,
      "TOTALLAB_AMTFC": 0,
      "TOTALLAB_AMTCC": 0,
      "TOTALLAB_AMTFCNEW": 0,
      "TOTALLAB_AMTCCNEW": 0,
      "MFGVOC_REF": "string",
      "MFGVOC_DATE": "2023-10-14T08:59:56.964Z",
      "COST_CODE": "string",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "string",
      "PRICE2PER": "string",
      "PRICE3PER": "string",
      "PRICE4PER": "string",
      "PRICE5PER": "string",
      "PRICE1FC": 0,
      "PRICE1LC": 0,
      "PRICE2FC": 0,
      "PRICE2LC": 0,
      "PRICE3FC": 0,
      "PRICE3LC": 0,
      "PRICE4FC": 0,
      "PRICE4LC": 0,
      "PRICE5FC": 0,
      "PRICE5LC": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "PLAT_ACCODE": "string",
      "CERT_ACCODE": "string",
      "PLAT_CHARGESFC": 0,
      "PLAT_CHARGESCC": 0,
      "CERT_CHARGESFC": 0,
      "CERT_CHARGESCC": 0,
      "PLAT_CHARGESFCNEW": 0,
      "PLAT_CHARGESCCNEW": 0,
      "CERT_CHARGESFCNEW": 0,
      "CERT_CHARGESCCNEW": 0,
      "COLOR": "string",
      "TAG_LINES": "string",
      "REFMID": 0,
      "MAINCODE": "string",
      "SLNO": 0,
      "METALSTONE": "s",
      "DIVISION": "s",
      "DET_STOCK_CODE": "string",
      "RET_STOCK_CODE": "string",
      "KARAT_CODE": "stri",
      "PURITY": 0,
      "WEIGHT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "AMOUNTFC": 0,
      "AMOUNTCC": 0,
      "REMOVED": 0,
      "NEWENTRY": 0,
      "LOC_TYPE": "string",
      "SHAPE": "string",
      "SIEVE": "string",
      "STONE_TYPE": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "SIEVE_SET": "string",
      "approvalDetails": this.tableData,  
    }
  
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.jewelleryaltrationFrom.reset()
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

  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.jewelleryaltrationFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.jewelleryaltrationFrom.controls.vocno.setValue(this.content.VOCNO)
    this.jewelleryaltrationFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.jewelleryaltrationFrom.controls.lossaccount.setValue(this.content.LOSS_ACCODE)
    this.jewelleryaltrationFrom.controls.itemcurrency.setValue(this.content.CURRENCY_CODE)
    this.jewelleryaltrationFrom.controls.itemcurrencycc.setValue(this.content.CC_RATE)
    this.jewelleryaltrationFrom.controls.metalratetype.setValue(this.content.MET_RATE_TYPE)
    this.jewelleryaltrationFrom.controls.metalrate.setValue(this.content.METAL_RATE)
    this.jewelleryaltrationFrom.controls.narration.setValue(this.content.REMARKS)

    

  }


  update(){
    if (this.jewelleryaltrationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DiamondJewelAlteration/UpdateDiamondJewelAlteration/'+ this.jewelleryaltrationFrom.value.branchCode  + this.jewelleryaltrationFrom.value.voctype + this.jewelleryaltrationFrom.value.vocno + this.jewelleryaltrationFrom.value.vocdate
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jewelleryaltrationFrom.value.voctype || "",
      "VOCNO": this.jewelleryaltrationFrom.value.vocno || "",
      "VOCDATE": this.jewelleryaltrationFrom.value.vocdate || "",
      "YEARMONTH": "string",
      "SMAN": "string",
      "LOSS_ACCODE": this.jewelleryaltrationFrom.value.lossaccount || "",
      "CURRENCY_CODE": this.jewelleryaltrationFrom.value.itemcurrency || "",
      "CC_RATE": this.jewelleryaltrationFrom.value.itemcurrencycc || "",
      "MET_RATE_TYPE": this.jewelleryaltrationFrom.value.metalratetype || "",
      "METAL_RATE": this.jewelleryaltrationFrom.value.metalrate || "",
      "NAVSEQNO": 0,
      "TOTALPCS": 0,
      "TOTAL_LAB_CHARGECC": 0,
      "TOTAL_LAB_CHARGEFC": 0,
      "TOTAL_COST_OLDCC": 0,
      "TOTAL_COST_OLDFC": 0,
      "TOTAL_COST_NEWCC": 0,
      "TOTAL_COST_NEWFC": 0,
      "REMARKS": this.jewelleryaltrationFrom.value.narration || "",
      "PRINT_COUNT": 0,
      "POSTDATE": "string",
      "AUTOPOSTING": true,
      "HTUSERNAME": "string",
      "REMARKS_DETAIL": "string",
      "GENSEQNO": 0,
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "string",
      "DESCRIPTION": "string",
      "PCS": 0,
      "COSTFC": 0,
      "COSTCC": 0,
      "COSTFCNEW": 0,
      "COSTCCNEW": 0,
      "METALWT": 0,
      "PUREWT": 0,
      "STONEWT": 0,
      "GROSSWT": 0,
      "METAL_AMTFC": 0,
      "METAL_AMTCC": 0,
      "STONE_AMTFC": 0,
      "STONE_AMTCC": 0,
      "METALWT_NEW": 0,
      "PUREWT_NEW": 0,
      "STONEWT_NEW": 0,
      "GROSSWT_NEW": 0,
      "METAL_AMTFCNEW": 0,
      "METAL_AMTCCNEW": 0,
      "STONE_AMTFCNEW": 0,
      "STONE_AMTCCNEW": 0,
      "SET_ACCODE": "string",
      "SET_AMTFC": 0,
      "SET_AMTCC": 0,
      "SET_AMTFCNEW": 0,
      "SET_AMTCCNEW": 0,
      "POL_ACCODE": "string",
      "POL_AMTFC": 0,
      "POL_AMTCC": 0,
      "POL_AMTFCNEW": 0,
      "POL_AMTCCNEW": 0,
      "RHO_ACCODE": "string",
      "RHO_AMTFC": 0,
      "RHO_AMTCC": 0,
      "RHO_AMTFCNEW": 0,
      "RHO_AMTCCNEW": 0,
      "MKG_ACCODE": "string",
      "MKG_AMTFC": 0,
      "MKG_AMTCC": 0,
      "MKG_AMTFCNEW": 0,
      "MKG_AMTCCNEW": 0,
      "MIS_ACCODE": "string",
      "MIS_AMTFC": 0,
      "MIS_AMTCC": 0,
      "MIS_AMTFCNEW": 0,
      "MIS_AMTCCNEW": 0,
      "TOTALLAB_AMTFC": 0,
      "TOTALLAB_AMTCC": 0,
      "TOTALLAB_AMTFCNEW": 0,
      "TOTALLAB_AMTCCNEW": 0,
      "MFGVOC_REF": "string",
      "MFGVOC_DATE": "2023-10-14T08:59:56.964Z",
      "COST_CODE": "string",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "string",
      "PRICE2PER": "string",
      "PRICE3PER": "string",
      "PRICE4PER": "string",
      "PRICE5PER": "string",
      "PRICE1FC": 0,
      "PRICE1LC": 0,
      "PRICE2FC": 0,
      "PRICE2LC": 0,
      "PRICE3FC": 0,
      "PRICE3LC": 0,
      "PRICE4FC": 0,
      "PRICE4LC": 0,
      "PRICE5FC": 0,
      "PRICE5LC": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "PLAT_ACCODE": "string",
      "CERT_ACCODE": "string",
      "PLAT_CHARGESFC": 0,
      "PLAT_CHARGESCC": 0,
      "CERT_CHARGESFC": 0,
      "CERT_CHARGESCC": 0,
      "PLAT_CHARGESFCNEW": 0,
      "PLAT_CHARGESCCNEW": 0,
      "CERT_CHARGESFCNEW": 0,
      "CERT_CHARGESCCNEW": 0,
      "COLOR": "string",
      "TAG_LINES": "string",
      "REFMID": 0,
      "MAINCODE": "string",
      "SLNO": 0,
      "METALSTONE": "s",
      "DIVISION": "s",
      "DET_STOCK_CODE": "string",
      "RET_STOCK_CODE": "string",
      "KARAT_CODE": "stri",
      "PURITY": 0,
      "WEIGHT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "AMOUNTFC": 0,
      "AMOUNTCC": 0,
      "REMOVED": 0,
      "NEWENTRY": 0,
      "LOC_TYPE": "string",
      "SHAPE": "string",
      "SIEVE": "string",
      "STONE_TYPE": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "SIEVE_SET": "string",
    }
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.jewelleryaltrationFrom.reset()
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
  
  deleteRecord() {
    if (!this.content.VOCTYPE) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'DiamondJewelAlteration/DeleteDiamondJewelAlteration/' + this.jewelleryaltrationFrom.value.branchCode  + this.jewelleryaltrationFrom.value.voctype + this.jewelleryaltrationFrom.value.vocno + this.jewelleryaltrationFrom.value.vocdate
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.jewelleryaltrationFrom.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.jewelleryaltrationFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
