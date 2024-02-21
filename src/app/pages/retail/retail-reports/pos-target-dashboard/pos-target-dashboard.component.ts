import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';


@Component({
  selector: 'app-pos-target-dashboard',
  templateUrl: './pos-target-dashboard.component.html',
  styleUrls: ['./pos-target-dashboard.component.scss']
})


export class PosTargetDashboardComponent implements OnInit {
  divisionMS: any;

  mtdcolumnhead:any[] = ['Branch','Branch Name','Date','MTD Target','Achieved','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];

  ytdcolumnhead:any[] = ['Branch','Branch Name','Date','MTD Target','Achieved','Ach.%','Var_Amount','%','Prv year 1','YOY %','Prv Year 2','YOY %','New Daily Trgt'];



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


