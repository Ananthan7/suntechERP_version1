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
  selector: 'app-job-creation',
  templateUrl: './job-creation.component.html',
  styleUrls: ['./job-creation.component.scss']
})
export class JobCreationComponent implements OnInit {
  //variables
  modalReference: any;
  closeResult: any;
  pageTitle: any;
  currentFilter: any;
  showFilterRow: boolean = false;
  showHeaderFilter: boolean = false;
  divisionMS: any = 'ID';
  itemList: any[] = []

  columnheadIncome: any[] = ['', '', '', '', '', '', '', '', ''];
  @Input() content!: any;
  tableData: any[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  jobcreationFrom: FormGroup = this.formBuilder.group({

  });


  removedata() {
    this.tableData.pop();
  }
  formSubmit() {

  }




}
