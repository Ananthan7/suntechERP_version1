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
  selector: 'app-jewellery-dismantling',
  templateUrl: './jewellery-dismantling.component.html',
  styleUrls: ['./jewellery-dismantling.component.scss']
})
export class JewelleryDismantlingComponent implements OnInit {
  divisionMS: any = 'ID';
  columnheads:any[] = ['SrNo','Stock Code','Description', 'Pcs','Metal/Value','Lab Amount','Total Amount','Loss','MFGRE','MFGDATE',' Settings','Remarks','Locations'];
  columnhead :any[] = ['Col ID','Division','Cols','ColR','ColKt','Fes','Weight','Rate','Amount','Pcs','RecWeight','RecAmount','Re...','...']
 @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
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

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
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

    this.setvalues()
  }

  userDataSelected(value: any) {
    console.log(value);
       this.jewellerydismantlingFrom.controls.enteredby.setValue(value.UsersName);
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.jewellerydismantlingFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  addTableData(){ 
  
  }
  
  deleteTableData(){
   
  }

  addTableDatas(){ 

  }

 jewellerydismantlingFrom: FormGroup = this.formBuilder.group({
   voctype:['',[Validators.required]],
   vocno:['',[Validators.required]],
   vocdate:[,[Validators.required]],
   enteredby:[''],
   lossaccount:[''],
   itemcurrency:[''],
   itemcurrencDesc:[''],
   metalrate:[''],
   metalratetype:[''],
   base:[''],
   baseDesc : [''],
   narration:[''],
   stock : [''],
   description : [''],
   pcs : [''],
   totalValue : [''],
   mfgDate : [''],
   lossAccount : [''],
   mfgfurRef : [''],
   location : [''],
   setting : [''],
   labourCharge : [''],
   polishing : [''],
   miscCode : [''],
   labTotal : [''],
  });

  setvalues(){
    this.jewellerydismantlingFrom.controls.voctype.setValue('MDM')
    this.jewellerydismantlingFrom.controls.vocno.setValue('1')
    this.jewellerydismantlingFrom.controls.vocdate.setValue(new Date())
  }


  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.jewellerydismantlingFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DiamondDismantle/InsertDiamondDismantle'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jewellerydismantlingFrom.value.voctype || "",
      "VOCNO": this.jewellerydismantlingFrom.value.vocno || "",
      "VOCDATE": this.jewellerydismantlingFrom.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "SMAN": "",
      "LOSS_ACCODE": this.jewellerydismantlingFrom.value.lossaccount || "",
      "CURRENCY_CODE": this.jewellerydismantlingFrom.value.itemcurrency || "",
      "CC_RATE": this.jewellerydismantlingFrom.value.itemcurrencDesc || "",
      "MET_RATE_TYPE": this.jewellerydismantlingFrom.value.metalratetype || "",
      "METAL_RATE": this.jewellerydismantlingFrom.value.metalrate || "",
      "NAVSEQNO": 0,
      "TOTALPCS": this.jewellerydismantlingFrom.value.pcs || "",
      "TOTMETALAMOUNTFC": 0,
      "TOTMETALAMOUNTCC": 0,
      "TOTSTONEAMOUNTFC": 0,
      "TOTSTONEAMOUNTCC": 0,
      "TOTLABOURAMOUNTFC": 0,
      "TOTLABOURAMOUNTCC": 0,
      "TOTLOSSAMOUNTFC": 0,
      "TOTLOSSAMOUNTCC": 0,
      "TOTAMOUNTFC": 0,
      "TOTAMOUNTCC": 0,
      "HREMARKS": this.jewellerydismantlingFrom.value.narration || "",
      "GENSEQNO": 0,
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "HTUSERNAME": this.jewellerydismantlingFrom.value.enteredby,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "DESCRIPTION": "",
          "PCS": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTCC": 0,
          "STONE_AMOUNTFC": 0,
          "STONE_AMOUNTCC": 0,
          "LABOR_AMOUNTFC": 0,
          "LABOR_AMOUNTCC": 0,
          "LOSS_AMOUNTFC": 0,
          "LOSS_AMOUNTCC": 0,
          "SETTINGCHARGEFC": 0,
          "SETTINGCHARGECC": 0,
          "POLISHCHARGEFC": 0,
          "POLISHCHARGECC": 0,
          "RHODIUMCHARGEFC": 0,
          "RHODIUMCHARGECC": 0,
          "LABOURCHARGEFC": 0,
          "LABOURCHARGECC": 0,
          "MISCLCHARGEFC": 0,
          "MISCLCHARGECC": 0,
          "TOTALAMOUNTFC": 0,
          "TOTALAMOUNTCC": 0,
          "MFGVOC_REF": "",
          "MFGVOC_DATE": "2023-10-19T09:20:05.269Z",
          "LOSS_ACCODE": "",
          "COST_CODE": "",
          "DIFF_TOTAL": 0,
          "RCVD_TOTAL": 0,
          "DIFF_WGT": 0,
          "DREMARKS": "",
          "DLOCTYPE_CODE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": ""
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
                this.jewellerydismantlingFrom.reset()
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
  }


  update(){
    if (this.jewellerydismantlingFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DiamondDismantle/UpdateDiamondDismantle'+ this.jewellerydismantlingFrom.value.branchCode + this.jewellerydismantlingFrom.value.voctype + this.jewellerydismantlingFrom.value.vocno + this.jewellerydismantlingFrom.value.yearMonth;
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jewellerydismantlingFrom.value.voctype || "",
      "VOCNO": this.jewellerydismantlingFrom.value.vocno || "",
      "VOCDATE": this.jewellerydismantlingFrom.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "SMAN": "",
      "LOSS_ACCODE": this.jewellerydismantlingFrom.value.lossaccount || "",
      "CURRENCY_CODE": this.jewellerydismantlingFrom.value.itemcurrency || "",
      "CC_RATE": this.jewellerydismantlingFrom.value.itemcurrencDesc || "",
      "MET_RATE_TYPE": this.jewellerydismantlingFrom.value.metalratetype || "",
      "METAL_RATE": this.jewellerydismantlingFrom.value.metalrate || "",
      "NAVSEQNO": 0,
      "TOTALPCS": 0,
      "TOTMETALAMOUNTFC": 0,
      "TOTMETALAMOUNTCC": 0,
      "TOTSTONEAMOUNTFC": 0,
      "TOTSTONEAMOUNTCC": 0,
      "TOTLABOURAMOUNTFC": 0,
      "TOTLABOURAMOUNTCC": 0,
      "TOTLOSSAMOUNTFC": 0,
      "TOTLOSSAMOUNTCC": 0,
      "TOTAMOUNTFC": 0,
      "TOTAMOUNTCC": 0,
      "HREMARKS": this.jewellerydismantlingFrom.value.narration || "",
      "GENSEQNO": 0,
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "HTUSERNAME":  "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "DESCRIPTION": "",
          "PCS": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTCC": 0,
          "STONE_AMOUNTFC": 0,
          "STONE_AMOUNTCC": 0,
          "LABOR_AMOUNTFC": 0,
          "LABOR_AMOUNTCC": 0,
          "LOSS_AMOUNTFC": 0,
          "LOSS_AMOUNTCC": 0,
          "SETTINGCHARGEFC": 0,
          "SETTINGCHARGECC": 0,
          "POLISHCHARGEFC": 0,
          "POLISHCHARGECC": 0,
          "RHODIUMCHARGEFC": 0,
          "RHODIUMCHARGECC": 0,
          "LABOURCHARGEFC": 0,
          "LABOURCHARGECC": 0,
          "MISCLCHARGEFC": 0,
          "MISCLCHARGECC": 0,
          "TOTALAMOUNTFC": 0,
          "TOTALAMOUNTCC": 0,
          "MFGVOC_REF": "",
          "MFGVOC_DATE": "2023-10-19T09:20:05.269Z",
          "LOSS_ACCODE": "",
          "COST_CODE": "",
          "DIFF_TOTAL": 0,
          "RCVD_TOTAL": 0,
          "DIFF_WGT": 0,
          "DREMARKS": "",
          "DLOCTYPE_CODE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": ""
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
                this.jewellerydismantlingFrom.reset()
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
        let API = 'DiamondDismantle/DeleteDiamondDismantle/'+ this.jewellerydismantlingFrom.value.branchCode + this.jewellerydismantlingFrom.value.voctype + this.jewellerydismantlingFrom.value.vocno + this.jewellerydismantlingFrom.value.yearMonth
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
                    this.jewellerydismantlingFrom.reset()
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
                    this.jewellerydismantlingFrom.reset()
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
  
 
}
