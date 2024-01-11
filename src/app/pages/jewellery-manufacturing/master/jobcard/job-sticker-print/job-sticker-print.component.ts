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

@Component({
  selector: 'app-job-sticker-print',
  templateUrl: './job-sticker-print.component.html',
  styleUrls: ['./job-sticker-print.component.scss']
})
export class JobStickerPrintComponent implements OnInit {

  selectedTabIndex = 0;
  tableData: any = [];
  showHeaderFilter: boolean;
  currentFilter: any;
  showFilterRow: boolean;
  allMode: string;
  checkBoxesMode: string;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { 
    this.showHeaderFilter = true;
    this.showFilterRow = true;
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }


}
