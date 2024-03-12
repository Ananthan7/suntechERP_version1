import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

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

  private subscriptions: Subscription[] = [];


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

  posSalesmanTargetAnalysis: FormGroup = this.formBuilder.group({
    vocDate: [new Date()],
    salesPersonCode: [''],   
  });

  formSubmit() {
   

    if (this.posSalesmanTargetAnalysis.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = '/SalesMan'
    let postData =[
      {
        "salesPersonCode": this.posSalesmanTargetAnalysis.value.salesPersonCode,
        "Description": " "
      }
    ]
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
                this.posSalesmanTargetAnalysis.reset()
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
