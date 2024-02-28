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
  selector: 'app-diamond-branch-transfer-out-repair',
  templateUrl: './diamond-branch-transfer-out-repair.component.html',
  styleUrls: ['./diamond-branch-transfer-out-repair.component.scss']
})
export class DiamondBranchTransferOutRepairComponent implements OnInit {
  divisionMS: any = 'ID';
  columnheads:any[] = ['Div','St.Code','Description', 'Pcs','Gross Wt','Rate','Net AmountCC','Net AmountFC','Tot.FC','CGST'];
  columnhead :any[] = ['Col ID','Division','Cols','ColR','ColKt','Fes','Weight','Rate','Amount','Pcs','RecWeight','RecAmount','Re...','...']
 @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();

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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
