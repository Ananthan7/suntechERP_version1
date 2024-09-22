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
  selector: 'app-pos-salesman-commission',
  templateUrl: './pos-salesman-commission.component.html',
  styleUrls: ['./pos-salesman-commission.component.scss']
})
export class PosSalesmanCommissionComponent implements OnInit {

  columnhead: any[] = ['S.No', 'Salesman', 'Amount',];
  @Input() content!: any;
  tableData: any[] = [];
  jewelleryaltrationdetail: any[] = [];
  detailData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  selectRowIndex: any;
  tableRowCount: number = 0;
  currentDate = new Date();
  viewMode: boolean = false;
  selectedKey: number[] = []
  isLoading: boolean = false;

  
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
