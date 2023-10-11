import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JewelleryAltrationDetailsComponent } from '../jewellery-altration/jewellery-altration-details/jewellery-altration-details.component';
import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling-details/jewellery-assembling-details.component';

@Component({
  selector: 'app-jewellery-assembling',
  templateUrl: './jewellery-assembling.component.html',
  styleUrls: ['./jewellery-assembling.component.scss']
})
export class JewelleryAssemblingComponent implements OnInit {
  divisionMS: any = 'ID';
  column1:any[] = ['SRNO','Stock Code', 'PCS','Design','Type','Category','Sub Category','Brand','Cost Code','Price 1','Price 2','Location'];
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

  openjewelleryassemblingdetails() {
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAssemblingDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }
}
