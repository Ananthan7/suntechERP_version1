import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-allocation-melting',
  templateUrl: './job-allocation-melting.component.html',
  styleUrls: ['./job-allocation-melting.component.scss']
})
export class JobAllocationMeltingComponent implements OnInit {

  tableData: any[] = [];
  columnhead: any[] = ['Sr','SO No','Delivery Date','Party Code','Party Name','Job Number','UNQ Job ID','Job Desc','Design Code','UNQ Design ID','Metal Wt','Job Pcs']
  selectedValue: string = "1";
  currentDate = new Date();

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
