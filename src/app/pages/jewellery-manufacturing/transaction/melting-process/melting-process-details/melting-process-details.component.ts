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
  selector: 'app-melting-process-details',
  templateUrl: './melting-process-details.component.html',
  styleUrls: ['./melting-process-details.component.scss']
})
export class MeltingProcessDetailsComponent implements OnInit {
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingprocessdetailsForm.controls.jobno.setValue(e.job_number);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.meltingprocessdetailsForm.controls.location.setValue(e.LOCATION_CODE);
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


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  meltingprocessdetailsForm: FormGroup = this.formBuilder.group({
    jobno : ['',[Validators.required]],
    jobdes : [''],
    jobpurity : [''],
    process : ['',[Validators.required]],
    processdes : ['',[Validators.required]],
    worker : ['',[Validators.required]],
    workerdes : ['',[Validators.required]],
    treeno : [''],
    waxweight : [''],
    location : [''],
    stockcode : [''],
    stockcodedes : [''],
    tostockcode : [''],
    grossweight : ['',[Validators.required]],
    stoneweight : [''],
    pcs : [''],
    netweight : [''],
    purity : [''],
    purityper : [''],
    pureweight : [''],
    purediff : [''],
    remark : [''],
    lossweight : [''],
    lotno : ['',[Validators.required]],
    barno : ['',[Validators.required]],
    ticketno : ['',[Validators.required]],
    tgold: [''],
    sliver: ['',[Validators.required]],

  });

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.meltingprocessdetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingProcessDJ/InsertJobMeltingProcessDJ'
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-11-25T05:04:56.703Z",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.meltingprocessdetailsForm.value.jobno,
      "JOB_DESCRIPTION": this.meltingprocessdetailsForm.value.jobdes,
      "PROCESS_CODE": this.meltingprocessdetailsForm.value.process,
      "PROCESS_DESC": this.meltingprocessdetailsForm.value.processdes,
      "WORKER_CODE": this.meltingprocessdetailsForm.value.worker,
      "WORKER_DESC": this.meltingprocessdetailsForm.value.workerdes,
      "STOCK_CODE": this.meltingprocessdetailsForm.value.stockcode,
      "STOCK_DESCRIPTION": this.meltingprocessdetailsForm.value.stockcodedes,
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": this.meltingprocessdetailsForm.value.pcs,
      "GROSS_WT": this.meltingprocessdetailsForm.value.grossweight,
      "STONE_WT": this.meltingprocessdetailsForm.value.stoneweight,
      "PURITY": this.meltingprocessdetailsForm.value.purity,
      "PUREWT": this.meltingprocessdetailsForm.value.pureweight,
      "PUDIFF": this.meltingprocessdetailsForm.value.purediff,
      "IRON_WT": 0,
      "NET_WT": this.meltingprocessdetailsForm.value.netweight,
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": this.meltingprocessdetailsForm.value.waxweight,
      "TREE_NO": this.meltingprocessdetailsForm.value.treeno,
      "WIP_ACCODE": "string",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "REMARKS": this.meltingprocessdetailsForm.value.remark,
      "LOCTYPE_CODE": this.meltingprocessdetailsForm.value.location,
      "TOSTOCKCODE": this.meltingprocessdetailsForm.value.tostockcode,
      "LOSSWT": this.meltingprocessdetailsForm.value.lossweight,
      "TODIVISION_CODE": "s",
      "LOT_NO": this.meltingprocessdetailsForm.value.lotno,
      "BAR_NO": this.meltingprocessdetailsForm.value.barno,
      "TICKET_NO": this.meltingprocessdetailsForm.value.ticketno,
      "SILVER_PURITY": this.meltingprocessdetailsForm.value.sliver,
      "SILVER_PUREWT": 0,
      "TOPURITY": 0,
      "PUR_PER": this.meltingprocessdetailsForm.value.purityper,
      "MELTING_TYPE": "string",
      "ISALLOY": "s",
      "BALANCE_WT": 0,
      "BALANCE_PURE_WT": 0,
      "LOSS_PURE_WT": 0,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string"
    }
    this.close(postData);
  }

  setFormValues() {
  }

  update(){
    if (this.meltingprocessdetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'DiamondDismantle/UpdateDiamondDismantle'+ this.meltingprocessdetailsForm.value.branchCode + this.meltingprocessdetailsForm.value.voctype + this.meltingprocessdetailsForm.value.vocno + this.meltingprocessdetailsForm.value.yearMonth;
    let postData = {

        
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
                this.meltingprocessdetailsForm.reset()
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
        let API = 'DiamondDismantle/DeleteDiamondDismantle/'+ this.meltingprocessdetailsForm.value.branchCode + this.meltingprocessdetailsForm.value.voctype + this.meltingprocessdetailsForm.value.vocno + this.meltingprocessdetailsForm.value.yearMonth
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
                    this.meltingprocessdetailsForm.reset()
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
                    this.meltingprocessdetailsForm.reset()
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
