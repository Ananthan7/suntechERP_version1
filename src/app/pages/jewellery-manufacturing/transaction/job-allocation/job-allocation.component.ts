import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-job-allocation',
  templateUrl: './job-allocation.component.html',
  styleUrls: ['./job-allocation.component.scss']
})


export class JobAllocationComponent implements OnInit {
  
  tableData: any[] = [];  
  columnheadItemDetails:any[] = ['Design','Order.No','Process','Worker','Doc.Attachment','Std.Time','Priority','Customer','Job Number','Unq.Job.Id','Pcs',''];
  divisionMS: any = 'ID';

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }

    
   

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  jobaloocationFrom: FormGroup = this.formBuilder.group({


      vocType: ['', [Validators.required]],
      vocNum: ['', [Validators.required]],
      sLoctype: ['', [Validators.required]],
      mLoctype: ['', [Validators.required]], 
  });

  formSubmit(){

  }
}

