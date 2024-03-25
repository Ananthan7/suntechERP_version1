import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pos-target-dashboard',
  templateUrl: './pos-target-dashboard.component.html',
  styleUrls: ['./pos-target-dashboard.component.scss']
})


export class PosTargetDashboardComponent implements OnInit {
  divisionMS: any;

  mtdcolumnhead:any[] = ['Branch','Branch Name','Date','MTD Target','Achieved','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  ytdcolumnhead:any[] = ['Branch','Branch Name','Date','MTD Target','Achieved','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  currentDate = new Date(); 

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.POSTargetStatusForm.controls.branch.setValue(e.BRANCH_CODE);
    
  }

  POSTargetStatusForm: FormGroup = this.formBuilder.group({
    branch : [''],
    date : [''],
    POSTargetAnalysis: ['']

  });

  formatDate(event: any) {
    const inputDate = event.target.value;
    const parsedDate = new Date(inputDate);
  
    if (!isNaN(parsedDate.getTime())) {
      const formattedDate = this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
      event.target.value = formattedDate;
    } else {
      event.target.value = ''; 
      console.error('Invalid date input');
    }
  }

  formSubmit(){
    

    if (this.POSTargetStatusForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'UspPOSTargetYTD'
    let postData = {
    
        "str_CurrFyear": this.POSTargetStatusForm.value.POSTargetAnalysis,
        "strAsOnDate":  this.datePipe.transform(this.POSTargetStatusForm.value.date, 'dd/MM/yyyy'),
        "StrBranchList":  this.POSTargetStatusForm.value.branch,
        "intShowSummary": true
   
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.close('reloadMainGrid')
              }
            });
            this.POSTargetStatusForm.reset()
            this.tableData = []
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}


