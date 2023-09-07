import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-process-master',
  templateUrl: './process-master.component.html',
  styleUrls: ['./process-master.component.scss']
})
export class ProcessMasterComponent implements OnInit {
  @Input() content!: any; 

  processMasterForm: FormGroup = this.formBuilder.group({
    processCode: ['', [Validators.required]],
    processDesc: ['', [Validators.required]],
    processType: ['', [Validators.required]],
    stand_time: ['', [Validators.required]],
    wip_ac: ['', [Validators.required]],
    max_time: [''],
    processPosition: [''],
    trayWeight: [''],
    approvalCode: [''],
    approvalProcess: [''],
    recStockCode: [''],
    labour_charge: [''],

    DailyTarget: [false],
    MonthlyTarget: [false],
    YearlyTarget: [false],
  })

  constructor(   
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    let API = 'ProcessMasterDj/GetProcessMasterDJList'
    this.dataService.getDynamicAPI(API)
    .subscribe((result) => {
    console.log(result);

    });

    let API1 = 'StonePriceMasterDJ/GetStonePriceMasterList'
    this.dataService.getDynamicAPI(API1)
    .subscribe((result) => {
    console.log(result);

    });
    // if(this.content){
    //   this.setFormValues()
    // }
  }
  formSubmit(){
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

}
