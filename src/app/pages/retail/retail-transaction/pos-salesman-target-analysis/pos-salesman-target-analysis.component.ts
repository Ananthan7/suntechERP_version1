import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-pos-salesman-target-analysis',
  templateUrl: './pos-salesman-target-analysis.component.html',
  styleUrls: ['./pos-salesman-target-analysis.component.scss']
})
export class PosSalesmanTargetAnalysisComponent implements OnInit {
  divisionMS: any;

  mtdcolumnhead:any[] = ['Code','Sales person','Date','M T D Target','Achieved','GP','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  ytdcolumnhead:any[] = ['Code','Sales person','Date','M T D Target','Achieved','GP','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  branchcolumnhead:any[]=['Code','Sales person','Pcs / Grms','Branch','Sales Amount','GP %'];


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

  formSubmit(){

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
