import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { JobVerificationComponent } from './favorites/job-verification/job-verification.component';
import { JobWorkAllocationComponent } from './favorites/job-work-allocation/job-work-allocation.component';
import { SalesOrderAmendmentComponent } from './favorites/sales-order-amendment/sales-order-amendment.component';
import { ProducationLossRecoveryComponent } from './favorites/producation-loss-recovery/producation-loss-recovery.component';

@Component({
  selector: 'app-jewellery-manufacturing',
  templateUrl: './jewellery-manufacturing.component.html',
  styleUrls: ['./jewellery-manufacturing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JewelleryManufacturingComponent implements OnInit {
  menuTitle: any;
  branchCode: any;
  constructor(
    public dataService: SuntechAPIService,
    private CommonService: CommonServiceService,
    private ChangeDetector: ChangeDetectorRef,
      private modalService: NgbModal,
  ) {
  }
  data: any;
  dataPie: any;

  options: any;

  ngOnInit(): void {
    //use: to get menu title from queryparams
    this.menuTitle = this.CommonService.getTitleName()

  }

  openJobVerification() {
    // let i = 0;
    const modalRef: NgbModalRef = this.modalService.open(JobVerificationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openProducationLossRecovery(){
    const modalRef: NgbModalRef = this.modalService.open(ProducationLossRecoveryComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openJobworkallocation() {
    // let i = 0;
    const modalRef: NgbModalRef = this.modalService.open(JobWorkAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  
  opensalesorderamendment() {
    // let i = 0;
    const modalRef: NgbModalRef = this.modalService.open(SalesOrderAmendmentComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  menuClicked(event: any) {
    this.menuTitle = event.MENU_MODULE
  }
}
