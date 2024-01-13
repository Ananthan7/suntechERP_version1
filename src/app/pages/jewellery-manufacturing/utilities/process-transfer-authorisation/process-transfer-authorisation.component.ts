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
  selector: 'app-process-transfer-authorisation',
  templateUrl: './process-transfer-authorisation.component.html',
  styleUrls: ['./process-transfer-authorisation.component.scss']
})
export class ProcessTransferAuthorisationComponent implements OnInit {
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead: any[] = ['No','User Name','Branch','VocType','Voc No','Voc Date','DocTime','System Date/Time','Job No','Form Process','To Process','From Worker','To Worker','Job Pcs','Gross Wt','Loss Qty','Authorise']
  columnheadcadSketch: any[] = ['BRANCH_CODE','VOCTYPE','VOCNO','VOCDATE','USER_CODE','YEARMONTH','APPR_TYPE'];
  columnheadAuthorizedVoc: any[] = ['Sno','BranchCode','Voctype','YearMonth','Job Number','UnqJobId','UserId','Doc Time','AuthorisedDate','Idle Time','System Name','MainVoctype'];
  columnheadHoldingTransfer: any[] = ['No','Branch','VocType','Voc No','Voc Date','Voc Time','Job No','From Process','To Process','From Worker','To Worker','Job Pcs','Gross Wt','Loss Qty'];


  processTransferAuthorisationForm: FormGroup = this.formBuilder.group({
    fromDate:[''],
    toDate:[''],
    branch:[''],
    tranctionType:[''],
    process:[''],
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
    console.log(this.branchCode);
    
    this.yearMonth = this.comService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }

}
