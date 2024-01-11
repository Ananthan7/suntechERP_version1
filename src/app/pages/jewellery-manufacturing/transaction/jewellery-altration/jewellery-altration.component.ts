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

  columnhead:any[] = ['SrNo','Stock Code','Description', 'Pcs','Metal','Stone ','Gross','Cost (OLD)','Cost (New)','Remark'];
  @Input() content!: any; 
  tableData: any[] = [];
  jewelleryaltrationdetail : any[] =[];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();

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
 
  costCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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
    this.yearMonth = this.comService.yearSelected;
  }

  costCodeSelected(e:any){
    console.log(e);
    this.jewelleryaltrationFrom.controls.costcode.setValue(e.COST_CODE);
  }

  userDataSelected(value: any) {
    console.log(value);
       this.jewelleryaltrationFrom.controls.enteredby.setValue(value.UsersName);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  jewelleryaltrationFrom: FormGroup = this.formBuilder.group({
    voctype:['DJA',[Validators.required]],
    vocno:['1',[Validators.required]],
   vocdate:['',[Validators.required]],
   metalrate:['18k',[Validators.required]],
   metalratetype:['177.000000'],
   costcode:[''],
   lossaccount:[''],
   enteredby:[''],
   itemcurrency:['AED'],
   itemcurrencycc:['1.000000'],
   narration:[''],
  });


  openjewelleryaltrationdetails() {
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAltrationDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);       
        this.jewelleryaltrationdetail.push(postData);
        console.log(this.jewelleryaltrationdetail);
        
      }
    });


  }

  deleteTableData(){
 
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
      "YEARMONTH": this.yearMonth,
      "SMAN": this.jewelleryaltrationFrom.value.enteredby || "",
      "LOSS_ACCODE": this.jewelleryaltrationFrom.value.lossaccount || "",
      "CURRENCY_CODE": this.jewelleryaltrationFrom.value.itemcurrency || "",
      "CC_RATE": 0,
      "MET_RATE_TYPE": this.jewelleryaltrationFrom.value.metalratetype || "",
      "METAL_RATE":this.jewelleryaltrationFrom.value.metalrate || "",
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
      "POSTDATE": "",
      "AUTOPOSTING": true,
      "HTUSERNAME": "",
      "REMARKS_DETAIL": "",
      "GENSEQNO": 0,
      "Details": this.jewelleryaltrationdetail,
      
      "DetailComponents": [
        {
          "REFMID": 0,
          "MAINCODE": "str",
          "SLNO": 0,
          "METALSTONE": "s",
          "DIVISION": "s",
          "DET_STOCK_CODE": "",
          "RET_STOCK_CODE": "",
          "KARAT_CODE": "",
          "PURITY": 0,
          "PCS": 0,
          "WEIGHT": 0,
          "PUREWT": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "AMOUNTFC": 0,
          "AMOUNTCC": 0,
          "REMOVED": 0,
          "NEWENTRY": 0,
          "LOC_TYPE": "",
          "COLOR": "",
          "SHAPE": "",
          "SIEVE": "",
          "STONE_TYPE": "",
          "CLARITY": "",
          "SIZE": "",
          "SIEVE_SET": ""
        }
      ]
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



  update(){
    if (this.jewelleryaltrationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DiamondJewelAlteration/UpdateDiamondJewelAlteration/'+ this.jewelleryaltrationFrom.value.branchCode  + this.jewelleryaltrationFrom.value.voctype + this.jewelleryaltrationFrom.value.vocno + this.jewelleryaltrationFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jewelleryaltrationFrom.value.voctype || "",
      "VOCNO": this.jewelleryaltrationFrom.value.vocno || "",
      "VOCDATE": this.jewelleryaltrationFrom.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "SMAN": this.jewelleryaltrationFrom.value.enteredby || "",
      "LOSS_ACCODE": this.jewelleryaltrationFrom.value.lossaccount || "",
      "CURRENCY_CODE": this.jewelleryaltrationFrom.value.itemcurrency || "",
      "CC_RATE": 0,
      "MET_RATE_TYPE": this.jewelleryaltrationFrom.value.metalratetype || "",
      "METAL_RATE":this.jewelleryaltrationFrom.value.metalrate || "",
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
      "POSTDATE": "",
      "AUTOPOSTING": true,
      "HTUSERNAME": "",
      "REMARKS_DETAIL": "",
      "GENSEQNO": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "DESCRIPTION": "",
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
          "SET_ACCODE": "",
          "SET_AMTFC": 0,
          "SET_AMTCC": 0,
          "SET_AMTFCNEW": 0,
          "SET_AMTCCNEW": 0,
          "POL_ACCODE": "",
          "POL_AMTFC": 0,
          "POL_AMTCC": 0,
          "POL_AMTFCNEW": 0,
          "POL_AMTCCNEW": 0,
          "RHO_ACCODE": "",
          "RHO_AMTFC": 0,
          "RHO_AMTCC": 0,
          "RHO_AMTFCNEW": 0,
          "RHO_AMTCCNEW": 0,
          "MKG_ACCODE": "",
          "MKG_AMTFC": 0,
          "MKG_AMTCC": 0,
          "MKG_AMTFCNEW": 0,
          "MKG_AMTCCNEW": 0,
          "MIS_ACCODE": "",
          "MIS_AMTFC": 0,
          "MIS_AMTCC": 0,
          "MIS_AMTFCNEW": 0,
          "MIS_AMTCCNEW": 0,
          "TOTALLAB_AMTFC": 0,
          "TOTALLAB_AMTCC": 0,
          "TOTALLAB_AMTFCNEW": 0,
          "TOTALLAB_AMTCCNEW": 0,
          "MFGVOC_REF": "",
          "MFGVOC_DATE": "2023-10-25T05:39:49.369Z",
          "LOSS_ACCODE": "",
          "COST_CODE": "",
          "REMARKS_DETAIL": "",
          "STOCK_FCCOST": 0,
          "STOCK_LCCOST": 0,
          "PRICE1PER": "",
          "PRICE2PER": "",
          "PRICE3PER": "",
          "PRICE4PER": "",
          "PRICE5PER": "",
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
          "CURRENCY_CODE": "",
          "CC_RATE": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "PLAT_ACCODE": "",
          "CERT_ACCODE": "",
          "PLAT_CHARGESFC": 0,
          "PLAT_CHARGESCC": 0,
          "CERT_CHARGESFC": 0,
          "CERT_CHARGESCC": 0,
          "PLAT_CHARGESFCNEW": 0,
          "PLAT_CHARGESCCNEW": 0,
          "CERT_CHARGESFCNEW": 0,
          "CERT_CHARGESCCNEW": 0,
          "COLOR": "",
          "TAG_LINES": ""
        }
      ],
      "DetailComponents": [
        {
          "REFMID": 0,
          "MAINCODE": "",
          "SLNO": 0,
          "METALSTONE": "",
          "DIVISION": "",
          "DET_STOCK_CODE": "",
          "RET_STOCK_CODE": "",
          "KARAT_CODE": "",
          "PURITY": 0,
          "PCS": 0,
          "WEIGHT": 0,
          "PUREWT": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "AMOUNTFC": 0,
          "AMOUNTCC": 0,
          "REMOVED": 0,
          "NEWENTRY": 0,
          "LOC_TYPE": "",
          "COLOR": "",
          "SHAPE": "",
          "SIEVE": "",
          "STONE_TYPE": "",
          "CLARITY": "",
          "SIZE": "",
          "SIEVE_SET": ""
        }
      ]
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
        let API = 'DiamondJewelAlteration/DeleteDiamondJewelAlteration/' + this.jewelleryaltrationFrom.value.branchCode  + this.jewelleryaltrationFrom.value.voctype + this.jewelleryaltrationFrom.value.vocno + this.jewelleryaltrationFrom.value.yearMonth
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
