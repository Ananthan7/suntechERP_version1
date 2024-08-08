import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { JobcardComponent } from '../jobcard.component';



@Component({
  selector: 'app-job-sticker-print',
  templateUrl: './job-sticker-print.component.html',
  styleUrls: ['./job-sticker-print.component.scss']
})
export class JobStickerPrintComponent implements OnInit {

  selectedTabIndex = 0;
  viewMode: boolean = false;
  tableData: any = [];
  tableDataProcess: any[] = [];
  showHeaderFilter: boolean;
  currentFilter: any;
  showFilterRow: boolean;
  allMode: string;
  checkBoxesMode: string;
  selectedValue: string = 'PREVIEW';
  branchCode?: String;
  private subscriptions: Subscription[] = [];
  jobNumber: any = [];
  @Input() content!: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) {
    this.showHeaderFilter = true;
    this.showFilterRow = true;
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  jobstickerpointForm: FormGroup = this.formBuilder.group({
    sgljobfltr: [],
    jobrange: [],
    jobrangeDesc: [''],
    blankjobpouch: [''],
    mrqprint: [''],
    selectedvalue: [''],
    rftag: [''],
    normaltag: [''],
    setref: [''],
    printjobpouch: [''],
    printjobpouchwithcomponents: [''],
    prtonelblperpge: [''],
    stones: [''],
  });

  ngOnInit(): void {
  
      this.priceSchemeValidate();
    

    console.log(this.content?.FLAG)
    this.branchCode = this.commonService.branchCode;
    // this.priceSchemeValidate();

  
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      console.log("view")

    } else if (this.content.FLAG == 'EDIT') {
      console.log("edit")
      this.priceSchemeValidate();

    } else if (this.content.FLAG == 'DELETE') {
      this.viewMode = true;
      console.log("delete")
    }


  }

  // getfiltercode() {

  //   let API = 'JobMasterDj/GetJobMasterDjHeaderDetail/' + this.branchCode + '/' + this.jobstickerpointForm.value.jobrange + '?DBBranch=' + this.branchCode;
  //   // let API = 'JobMasterDj/GetJobMasterDjHeaderDetail/'+ this.branchCode+'/45353539'+'?DBBranch='+ this.branchCode;
  //   let Sub: Subscription = this.dataService.getDynamicAPICustom(API)
  //     .subscribe((result) => {
  //       if (result.status == "Success") {
  //         this.tableDataProcess.push(result.response);
  //         console.log(this.tableDataProcess)
  //       }
  //       else {
  //         this.commonService.toastErrorByMsgId(result.status)
  //       }
  //       // this.jobCardFrom.controls['color'].setValue(result.response.COLOR);
  //       // this.jobCardFrom.controls['karat'].setValue(result.response.KARAT_CODE);
  //       // this.jobCardFrom.controls['subcat'].setValue(result.response.SUBCATEGORY_CODE);
  //       // this.jobCardFrom.controls['prefix'].setValue(result.response.JOB_PREFIX);
  //       // this.jobCardFrom.controls['brand'].setValue(result.response.BRAND_CODE);
  //       // this.jobCardFrom.controls['jobtype'].setValue(result.response.DESIGN_TYPE);
  //       // this.jobCardFrom.controls['type'].setValue(result.response.TYPE_CODE);
  //       // this.jobCardFrom.controls['purity'].setValue(result.response.PURITY);

  //     }, err => {
  //       this.commonService.toastErrorByMsgId('MSG81451')//Server Error
  //     })
  //   this.subscriptions.push(Sub)

  // }

  getfiltercode() {
    // let postData = {
    //   "SPID": "107",
    //   "USP_FROMTO_JOBNUMBERFILTER": {
    //     "strBranchCode": "",
    //     "strVocType": "",
    //     "intVocNo": 0,
    //     "intMid": 0,
    //     "YearMonth": "",
    //     "FromJobNumber": this.jobstickerpointForm.value.jobrange,
    //     "ToJobNumber": this.jobstickerpointForm.value.jobrangeDesc,
    //     "chkSingleJob": true
    //   }
    // };
    let postData = {
      "SPID": "107",
      "parameter": {
        "strBranchCode": this.commonService.branchCode,
        "strVocType": "",
        "intVocNo": "0",
        "intMid": "0",
        "YearMonth": "",
        "FromJobNumber": this.commonService.nullToString(this.jobstickerpointForm.value.jobrange),
        "ToJobNumber": this.commonService.nullToString(this.jobstickerpointForm.value.jobrangeDesc),
        "chkSingleJob": "1"
      }
    };
  
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe(
        (result) => {
          if (result.status == "Success") {
            this.tableDataProcess = result.dynamicData[0] || [];
          } else {
            console.error("API returned an error:", result);
            this.commonService.toastErrorByMsgId('MSG1531');
          }
        },
        (err) => {
          console.error("API call failed:", err);
          this.commonService.toastErrorByMsgId('MSG1531');
        }
      );
  
    this.subscriptions.push(Sub);
  }
  


  priceSchemeValidate() {
    console.log(this.content)
    this.jobstickerpointForm.controls.jobrange.setValue(this.content);
    this.jobstickerpointForm.controls.jobrangeDesc.setValue(this.content);

    // this.jobCardFrom.controls.jobCardFrom.setValue(e.PRICE_CODE)
    // let postData = {
    //   "SPID": "096",
    //   "parameter": {
    //     STRBRANCHCODE: this.branchCode
    //   }
    // }
    // let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    //   .subscribe((result) => {
    //     if (result.status == "Success") {
    //       //this.jobNumber = result.dynamicData[0][0].JOB_NO || []


    //       this.jobstickerpointForm.controls.jobrange.setValue(result.dynamicData[0][0].JOB_NO)
    //       this.jobstickerpointForm.controls.jobrangeDesc.setValue(result.dynamicData[0][0].JOB_NO)
    //       console.log(this.jobstickerpointForm.value.jobrange)
    //     }
    //   }, err => {
    //     this.commonService.toastErrorByMsgId('Server Error')
    //   })
    //  this.jobstickerpointForm.push(Sub)
  }


  close(data?: any) {
    this.activeModal.close(data);
  }

  okClick() {

  }

  cancelClick(data?: any) {
    this.activeModal.close(data);
  }
}
