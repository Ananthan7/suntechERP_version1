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
  selector: 'app-jewellery-altration-details',
  templateUrl: './jewellery-altration-details.component.html',
  styleUrls: ['./jewellery-altration-details.component.scss']
})
export class JewelleryAltrationDetailsComponent implements OnInit {


  divisionMS: any = 'ID';

  columnheads:any[] = ['Sr','Div','Components','Location','Kt','Purity','Pcs','Weight ','Rate','Amount','Sieve','Shape'];
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

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(e:any){
    console.log(e);
    this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(e.STOCK_CODE);
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



  jewelleryaltrationdetailsFrom: FormGroup = this.formBuilder.group({
   stockcode:[''],
   description:[''],
   pcs:[''],
   refvoc:[''],
   costcode:[''],
   dated:[''],
   karat:[''],
   metalcolor:[''],
   metalAMTFC:[''],
   metalWT:[''],
   metalAMTCC:[''],
   metalWTNEW:[''],
   diamonds:[''],
   gross:[''],
   grossWTNEW:[''],
   costFC:[''],
   costCC:[''],
   costFCNEW:[''],
   costCCNEW:[''],
   pricescheme:[''],
   price1:[''],
   price1PER:[''],
   price1FC:[''],
   price1LC:[''],
   price2:[''],
   price2FC:[''],
   price2LC:[''],
   price2PER:[''],
   price3:[''],
   price3FC:[''],
   price3LC:[''],
   price3PER:[''],
   price4:[''],
   price4FC:[''],
   price4LC:[''],
   price4PER:[''],
   price5:[''],
   price5FC:[''],
   price5LC:[''],
   price5PER:[''],
   settings:[''],
   settingsAMTFC:[''],
   settingsAMTCC:[''],
   polishing:[''],
   polishingAMTFC:[''],
   polishingAMTCC:[''],
   rhodium:[''],
   rhodiumAMTFC:[''],
   rhodiumAMTCC:[''],
   making:[''],
   makingAMTFC:[''],
   makingAMTCC:[''],
   platecharges:[''],
   platechargesFC:[''],
   platechargesCC:[''],
   certcharges:[''],
   certchargesFC:[''],
   certchargesCC:[''],
   misccharges:[''],
   miscchargesAMTFC:[''],
   miscchargesAMTCC:[''],
   totalAMTFC :[''],
   totalAMTCC :[''],
   remarks:[''],
  });


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
  if (this.jewelleryaltrationdetailsFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'DiamondJewelAlteration/InsertDiamondJewelAlteration'
  let postData = {
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
    "TOTAL_COST_OLDCC":0,
    "TOTAL_COST_OLDFC": 0,
    "TOTAL_COST_NEWCC": 0,
    "TOTAL_COST_NEWFC": 0,
    "REMARKS": this.jewelleryaltrationdetailsFrom.value.remarks || "",
    "PRINT_COUNT": 0,
    "POSTDATE": "string",
    "AUTOPOSTING": true,
    "HTUSERNAME": "string",
    "REMARKS_DETAIL": "string",
    "GENSEQNO": 0,
    "UNIQUEID": 0,
    "SRNO": 0,
    "STOCK_CODE": this.jewelleryaltrationdetailsFrom.value.stockcode || "",
    "DESCRIPTION": this.jewelleryaltrationdetailsFrom.value.description || "",
    "PCS": this.jewelleryaltrationdetailsFrom.value.pcs || "",
    "COSTFC":this.jewelleryaltrationdetailsFrom.value.costFC || "",
    "COSTCC":this.jewelleryaltrationdetailsFrom.value.costCC || "",
    "COSTFCNEW": this.jewelleryaltrationdetailsFrom.value.costFCNEW || "",
    "COSTCCNEW": this.jewelleryaltrationdetailsFrom.value.costCCNEW || "",
    "METALWT": this.jewelleryaltrationdetailsFrom.value.metalWT || "",
    "PUREWT": 0,
    "STONEWT": 0,
    "GROSSWT": this.jewelleryaltrationdetailsFrom.value.gross || "",
    "METAL_AMTFC":this.jewelleryaltrationdetailsFrom.value.metalAMTFC || "",
    "METAL_AMTCC":this.jewelleryaltrationdetailsFrom.value.metalAMTCC || "",
    "STONE_AMTFC": 0,
    "STONE_AMTCC": 0,
    "METALWT_NEW": this.jewelleryaltrationdetailsFrom.value.metalWTNEW || "",
    "PUREWT_NEW": 0,
    "STONEWT_NEW": 0,
    "GROSSWT_NEW": this.jewelleryaltrationdetailsFrom.value.grossWTNEW || "",
    "METAL_AMTFCNEW": 0,
    "METAL_AMTCCNEW": 0,
    "STONE_AMTFCNEW": 0,
    "STONE_AMTCCNEW": 0,
    "SET_ACCODE": this.jewelleryaltrationdetailsFrom.value.settings || "",
    "SET_AMTFC":this.jewelleryaltrationdetailsFrom.value.settingsAMTFC || "",
    "SET_AMTCC": this.jewelleryaltrationdetailsFrom.value.settingsAMTCC || "",
    "SET_AMTFCNEW": 0,
    "SET_AMTCCNEW": 0,
    "POL_ACCODE": this.jewelleryaltrationdetailsFrom.value.polishing || "",
    "POL_AMTFC": this.jewelleryaltrationdetailsFrom.value.polishingAMTFC || "",
    "POL_AMTCC": this.jewelleryaltrationdetailsFrom.value.polishingAMTCC || "",
    "POL_AMTFCNEW": 0,
    "POL_AMTCCNEW": 0,
    "RHO_ACCODE": this.jewelleryaltrationdetailsFrom.value.rhodium || "",
    "RHO_AMTFC": this.jewelleryaltrationdetailsFrom.value.rhodiumAMTFC || "",
    "RHO_AMTCC": this.jewelleryaltrationdetailsFrom.value.rhodiumAMTCC || "",
    "RHO_AMTFCNEW": 0,
    "RHO_AMTCCNEW": 0,
    "MKG_ACCODE": this.jewelleryaltrationdetailsFrom.value.making || "",
    "MKG_AMTFC": this.jewelleryaltrationdetailsFrom.value.makingAMTFC || "",
    "MKG_AMTCC": this.jewelleryaltrationdetailsFrom.value.makingAMTCC || "",
    "MKG_AMTFCNEW": 0,
    "MKG_AMTCCNEW": 0,
    "MIS_ACCODE": this.jewelleryaltrationdetailsFrom.value.misccharges || "",
    "MIS_AMTFC":this.jewelleryaltrationdetailsFrom.value.miscchargesAMTFC || "",
    "MIS_AMTCC": this.jewelleryaltrationdetailsFrom.value.miscchargesAMTCC || "",
    "MIS_AMTFCNEW": 0,
    "MIS_AMTCCNEW": 0,
    "TOTALLAB_AMTFC": this.jewelleryaltrationdetailsFrom.value.totalAMTFC || "",
    "TOTALLAB_AMTCC": this.jewelleryaltrationdetailsFrom.value.totalAMTCC || "",
    "TOTALLAB_AMTFCNEW": 0,
    "TOTALLAB_AMTCCNEW": 0,
    "MFGVOC_REF": "string",
    "MFGVOC_DATE": "2023-10-14T08:59:56.964Z",
    "COST_CODE": this.jewelleryaltrationdetailsFrom.value.costcode || "",
    "STOCK_FCCOST": 0,
    "STOCK_LCCOST": 0,
    "PRICE1PER": this.jewelleryaltrationdetailsFrom.value.price1PER || "",
    "PRICE2PER": this.jewelleryaltrationdetailsFrom.value.price2PER || "",
    "PRICE3PER": this.jewelleryaltrationdetailsFrom.value.price3PER || "",
    "PRICE4PER": this.jewelleryaltrationdetailsFrom.value.price4PER || "",
    "PRICE5PER": this.jewelleryaltrationdetailsFrom.value.price5PER || "",
    "PRICE1FC": this.jewelleryaltrationdetailsFrom.value.price1FC || "",
    "PRICE1LC": this.jewelleryaltrationdetailsFrom.value.price1LC || "",
    "PRICE2FC": this.jewelleryaltrationdetailsFrom.value.price2FC || "",
    "PRICE2LC": this.jewelleryaltrationdetailsFrom.value.price2LC || "",
    "PRICE3FC": this.jewelleryaltrationdetailsFrom.value.price3FC || "",
    "PRICE3LC": this.jewelleryaltrationdetailsFrom.value.price3LC || "",
    "PRICE4FC": this.jewelleryaltrationdetailsFrom.value.price4FC || "",
    "PRICE4LC": this.jewelleryaltrationdetailsFrom.value.price4LC || "",
    "PRICE5FC": this.jewelleryaltrationdetailsFrom.value.price5FC || "",
    "PRICE5LC": this.jewelleryaltrationdetailsFrom.value.price5LC || "",
    "DT_BRANCH_CODE": "string",
    "DT_VOCTYPE": "str",
    "DT_VOCNO": 0,
    "DT_YEARMONTH": "string",
    "PLAT_ACCODE":this.jewelleryaltrationdetailsFrom.value.platecharges || "",
    "CERT_ACCODE": this.jewelleryaltrationdetailsFrom.value.certcharges || "",
    "PLAT_CHARGESFC": this.jewelleryaltrationdetailsFrom.value.platechargesFC || "",
    "PLAT_CHARGESCC": this.jewelleryaltrationdetailsFrom.value.platechargesCC || "",
    "CERT_CHARGESFC":this.jewelleryaltrationdetailsFrom.value.certchargesFC || "",
    "CERT_CHARGESCC":this.jewelleryaltrationdetailsFrom.value.certchargesCC || "",
    "PLAT_CHARGESFCNEW": 0,
    "PLAT_CHARGESCCNEW": 0,
    "CERT_CHARGESFCNEW": 0,
    "CERT_CHARGESCCNEW": 0,
    "COLOR": this.jewelleryaltrationdetailsFrom.value.metalcolor || "",
    "TAG_LINES": "string",
    "REFMID": this.jewelleryaltrationdetailsFrom.value.refvoc || "",
    "MAINCODE": "string",
    "SLNO": 0,
    "METALSTONE": "s",
    "DIVISION": "s",
    "DET_STOCK_CODE": "string",
    "RET_STOCK_CODE": "string",
    "KARAT_CODE": this.jewelleryaltrationdetailsFrom.value.karat || "",
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
              this.jewelleryaltrationdetailsFrom.reset()
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
  
  this.jewelleryaltrationdetailsFrom.controls.stockcode.setValue(this.content.STOCK_CODE)
  this.jewelleryaltrationdetailsFrom.controls.description.setValue(this.content.DESCRIPTION)
  this.jewelleryaltrationdetailsFrom.controls.pcs.setValue(this.content.PCS)
  this.jewelleryaltrationdetailsFrom.controls.refvoc.setValue(this.content.REFMID)
  this.jewelleryaltrationdetailsFrom.controls.costcode.setValue(this.content.costcode)
  this.jewelleryaltrationdetailsFrom.controls.karat.setValue(this.content.KARAT_CODE)
  this.jewelleryaltrationdetailsFrom.controls.metalcolor.setValue(this.content.metalcolor)
  this.jewelleryaltrationdetailsFrom.controls.metalAMTFC.setValue(this.content.METAL_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.metalWT.setValue(this.content.METALWT)
  this.jewelleryaltrationdetailsFrom.controls.metalAMTCC.setValue(this.content.METAL_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.metalWTNEW.setValue(this.content.metalWTNEW)
  this.jewelleryaltrationdetailsFrom.controls.gross.setValue(this.content.GROSSWT)
  this.jewelleryaltrationdetailsFrom.controls.grossWTNEW.setValue(this.content.GROSSWT_NEW)
  this.jewelleryaltrationdetailsFrom.controls.costFC.setValue(this.content.COSTFC)
  this.jewelleryaltrationdetailsFrom.controls.costCC.setValue(this.content.COSTCC)
  this.jewelleryaltrationdetailsFrom.controls.costFCNEW.setValue(this.content.COSTFCNEW)
  this.jewelleryaltrationdetailsFrom.controls.costCCNEW.setValue(this.content.COSTCCNEW)

  this.jewelleryaltrationdetailsFrom.controls.price1PER.setValue(this.content.PRICE1PER)
  this.jewelleryaltrationdetailsFrom.controls.price2PER.setValue(this.content.PRICE2PER)
  this.jewelleryaltrationdetailsFrom.controls.price3PER.setValue(this.content.PRICE3PER)
  this.jewelleryaltrationdetailsFrom.controls.price4PER.setValue(this.content.PRICE4PER)
  this.jewelleryaltrationdetailsFrom.controls.price5PER.setValue(this.content.PRICE5PER)

  this.jewelleryaltrationdetailsFrom.controls.price1FC.setValue(this.content.PRICE1FC)
  this.jewelleryaltrationdetailsFrom.controls.price2FC.setValue(this.content.PRICE2FC)
  this.jewelleryaltrationdetailsFrom.controls.price3FC.setValue(this.content.PRICE3FC)
  this.jewelleryaltrationdetailsFrom.controls.price4FC.setValue(this.content.PRICE4FC)
  this.jewelleryaltrationdetailsFrom.controls.price5FC.setValue(this.content.PRICE5FC)

  this.jewelleryaltrationdetailsFrom.controls.price1LC.setValue(this.content.PRICE1LC)
  this.jewelleryaltrationdetailsFrom.controls.price2LC.setValue(this.content.PRICE2LC)
  this.jewelleryaltrationdetailsFrom.controls.price3LC.setValue(this.content.PRICE3LC)
  this.jewelleryaltrationdetailsFrom.controls.price4LC.setValue(this.content.PRICE4LC)
  this.jewelleryaltrationdetailsFrom.controls.price5LC.setValue(this.content.PRICE5LC)

  this.jewelleryaltrationdetailsFrom.controls.settings.setValue(this.content.SET_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.settingsAMTFC.setValue(this.content.SET_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.settingsAMTCC.setValue(this.content.SET_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.polishing.setValue(this.content.POL_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.polishingAMTFC.setValue(this.content.POL_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.polishingAMTCC.setValue(this.content.POL_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.rhodium.setValue(this.content.RHO_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.rhodiumAMTFC.setValue(this.content.RHO_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.rhodiumAMTCC.setValue(this.content.RHO_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.making.setValue(this.content.MKG_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.makingAMTFC.setValue(this.content.MKG_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.makingAMTCC.setValue(this.content.MKG_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.platecharges.setValue(this.content.PLAT_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.platechargesFC.setValue(this.content.PLAT_CHARGESFC)
  this.jewelleryaltrationdetailsFrom.controls.platechargesCC.setValue(this.content.PLAT_CHARGESCC)
  this.jewelleryaltrationdetailsFrom.controls.certcharges.setValue(this.content.CERT_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.certchargesFC.setValue(this.content.CERT_CHARGESFC)
  this.jewelleryaltrationdetailsFrom.controls.certchargesCC.setValue(this.content.CERT_CHARGESCC)
  this.jewelleryaltrationdetailsFrom.controls.misccharges.setValue(this.content.MIS_ACCODE)
  this.jewelleryaltrationdetailsFrom.controls.miscchargesAMTFC.setValue(this.content.MIS_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.miscchargesAMTCC.setValue(this.content.MIS_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.totalAMTFC.setValue(this.content.TOTALLAB_AMTFC)
  this.jewelleryaltrationdetailsFrom.controls.totalAMTCC.setValue(this.content.TOTALLAB_AMTCC)
  this.jewelleryaltrationdetailsFrom.controls.remarks.setValue(this.content.REMARKS)
}


update(){
  if (this.jewelleryaltrationdetailsFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'DiamondJewelAlteration/UpdateDiamondJewelAlteration/'+ this.jewelleryaltrationdetailsFrom.value.branchCode  + this.jewelleryaltrationdetailsFrom.value.voctype + this.jewelleryaltrationdetailsFrom.value.vocno + this.jewelleryaltrationdetailsFrom.value.vocdate
  let postData = {
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
    "TOTAL_COST_OLDCC":0,
    "TOTAL_COST_OLDFC": 0,
    "TOTAL_COST_NEWCC": 0,
    "TOTAL_COST_NEWFC": 0,
    "REMARKS": this.jewelleryaltrationdetailsFrom.value.remarks || "",
    "PRINT_COUNT": 0,
    "POSTDATE": "string",
    "AUTOPOSTING": true,
    "HTUSERNAME": "string",
    "REMARKS_DETAIL": "string",
    "GENSEQNO": 0,
    "UNIQUEID": 0,
    "SRNO": 0,
    "STOCK_CODE": this.jewelleryaltrationdetailsFrom.value.stockcode || "",
    "DESCRIPTION": this.jewelleryaltrationdetailsFrom.value.description || "",
    "PCS": this.jewelleryaltrationdetailsFrom.value.pcs || "",
    "COSTFC":this.jewelleryaltrationdetailsFrom.value.costFC || "",
    "COSTCC":this.jewelleryaltrationdetailsFrom.value.costCC || "",
    "COSTFCNEW": this.jewelleryaltrationdetailsFrom.value.costFCNEW || "",
    "COSTCCNEW": this.jewelleryaltrationdetailsFrom.value.costCCNEW || "",
    "METALWT": this.jewelleryaltrationdetailsFrom.value.metalWT || "",
    "PUREWT": 0,
    "STONEWT": 0,
    "GROSSWT": this.jewelleryaltrationdetailsFrom.value.gross || "",
    "METAL_AMTFC":this.jewelleryaltrationdetailsFrom.value.metalAMTFC || "",
    "METAL_AMTCC":this.jewelleryaltrationdetailsFrom.value.metalAMTCC || "",
    "STONE_AMTFC": 0,
    "STONE_AMTCC": 0,
    "METALWT_NEW": this.jewelleryaltrationdetailsFrom.value.metalWTNEW || "",
    "PUREWT_NEW": 0,
    "STONEWT_NEW": 0,
    "GROSSWT_NEW": this.jewelleryaltrationdetailsFrom.value.grossWTNEW || "",
    "METAL_AMTFCNEW": 0,
    "METAL_AMTCCNEW": 0,
    "STONE_AMTFCNEW": 0,
    "STONE_AMTCCNEW": 0,
    "SET_ACCODE": this.jewelleryaltrationdetailsFrom.value.settings || "",
    "SET_AMTFC":this.jewelleryaltrationdetailsFrom.value.settingsAMTFC || "",
    "SET_AMTCC": this.jewelleryaltrationdetailsFrom.value.settingsAMTCC || "",
    "SET_AMTFCNEW": 0,
    "SET_AMTCCNEW": 0,
    "POL_ACCODE": this.jewelleryaltrationdetailsFrom.value.polishing || "",
    "POL_AMTFC": this.jewelleryaltrationdetailsFrom.value.polishingAMTFC || "",
    "POL_AMTCC": this.jewelleryaltrationdetailsFrom.value.polishingAMTCC || "",
    "POL_AMTFCNEW": 0,
    "POL_AMTCCNEW": 0,
    "RHO_ACCODE": this.jewelleryaltrationdetailsFrom.value.rhodium || "",
    "RHO_AMTFC": this.jewelleryaltrationdetailsFrom.value.rhodiumAMTFC || "",
    "RHO_AMTCC": this.jewelleryaltrationdetailsFrom.value.rhodiumAMTCC || "",
    "RHO_AMTFCNEW": 0,
    "RHO_AMTCCNEW": 0,
    "MKG_ACCODE": this.jewelleryaltrationdetailsFrom.value.making || "",
    "MKG_AMTFC": this.jewelleryaltrationdetailsFrom.value.makingAMTFC || "",
    "MKG_AMTCC": this.jewelleryaltrationdetailsFrom.value.makingAMTCC || "",
    "MKG_AMTFCNEW": 0,
    "MKG_AMTCCNEW": 0,
    "MIS_ACCODE": this.jewelleryaltrationdetailsFrom.value.misccharges || "",
    "MIS_AMTFC":this.jewelleryaltrationdetailsFrom.value.miscchargesAMTFC || "",
    "MIS_AMTCC": this.jewelleryaltrationdetailsFrom.value.miscchargesAMTCC || "",
    "MIS_AMTFCNEW": 0,
    "MIS_AMTCCNEW": 0,
    "TOTALLAB_AMTFC": this.jewelleryaltrationdetailsFrom.value.totalAMTFC || "",
    "TOTALLAB_AMTCC": this.jewelleryaltrationdetailsFrom.value.totalAMTCC || "",
    "TOTALLAB_AMTFCNEW": 0,
    "TOTALLAB_AMTCCNEW": 0,
    "MFGVOC_REF": "string",
    "MFGVOC_DATE": "2023-10-14T08:59:56.964Z",
    "COST_CODE": this.jewelleryaltrationdetailsFrom.value.costcode || "",
    "STOCK_FCCOST": 0,
    "STOCK_LCCOST": 0,
    "PRICE1PER": this.jewelleryaltrationdetailsFrom.value.price1PER || "",
    "PRICE2PER": this.jewelleryaltrationdetailsFrom.value.price2PER || "",
    "PRICE3PER": this.jewelleryaltrationdetailsFrom.value.price3PER || "",
    "PRICE4PER": this.jewelleryaltrationdetailsFrom.value.price4PER || "",
    "PRICE5PER": this.jewelleryaltrationdetailsFrom.value.price5PER || "",
    "PRICE1FC": this.jewelleryaltrationdetailsFrom.value.price1FC || "",
    "PRICE1LC": this.jewelleryaltrationdetailsFrom.value.price1LC || "",
    "PRICE2FC": this.jewelleryaltrationdetailsFrom.value.price2FC || "",
    "PRICE2LC": this.jewelleryaltrationdetailsFrom.value.price2LC || "",
    "PRICE3FC": this.jewelleryaltrationdetailsFrom.value.price3FC || "",
    "PRICE3LC": this.jewelleryaltrationdetailsFrom.value.price3LC || "",
    "PRICE4FC": this.jewelleryaltrationdetailsFrom.value.price4FC || "",
    "PRICE4LC": this.jewelleryaltrationdetailsFrom.value.price4LC || "",
    "PRICE5FC": this.jewelleryaltrationdetailsFrom.value.price5FC || "",
    "PRICE5LC": this.jewelleryaltrationdetailsFrom.value.price5LC || "",
    "DT_BRANCH_CODE": "string",
    "DT_VOCTYPE": "str",
    "DT_VOCNO": 0,
    "DT_YEARMONTH": "string",
    "PLAT_ACCODE":this.jewelleryaltrationdetailsFrom.value.platecharges || "",
    "CERT_ACCODE": this.jewelleryaltrationdetailsFrom.value.certcharges || "",
    "PLAT_CHARGESFC": this.jewelleryaltrationdetailsFrom.value.platechargesFC || "",
    "PLAT_CHARGESCC": this.jewelleryaltrationdetailsFrom.value.platechargesCC || "",
    "CERT_CHARGESFC":this.jewelleryaltrationdetailsFrom.value.certchargesFC || "",
    "CERT_CHARGESCC":this.jewelleryaltrationdetailsFrom.value.certchargesCC || "",
    "PLAT_CHARGESFCNEW": 0,
    "PLAT_CHARGESCCNEW": 0,
    "CERT_CHARGESFCNEW": 0,
    "CERT_CHARGESCCNEW": 0,
    "COLOR": this.jewelleryaltrationdetailsFrom.value.metalcolor || "",
    "TAG_LINES": "string",
    "REFMID": this.jewelleryaltrationdetailsFrom.value.refvoc || "",
    "MAINCODE": "string",
    "SLNO": 0,
    "METALSTONE": "s",
    "DIVISION": "s",
    "DET_STOCK_CODE": "string",
    "RET_STOCK_CODE": "string",
    "KARAT_CODE": this.jewelleryaltrationdetailsFrom.value.karat || "",
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
              this.jewelleryaltrationdetailsFrom.reset()
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
      let API = 'DiamondJewelAlteration/DeleteDiamondJewelAlteration/' + this.jewelleryaltrationdetailsFrom.value.branchCode  + this.jewelleryaltrationdetailsFrom.value.voctype + this.jewelleryaltrationdetailsFrom.value.vocno + this.jewelleryaltrationdetailsFrom.value.vocdate
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
                  this.jewelleryaltrationdetailsFrom.reset()
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
                  this.jewelleryaltrationdetailsFrom.reset()
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
