import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-verification',
  templateUrl: './job-verification.component.html',
  styleUrls: ['./job-verification.component.scss']
})
export class JobVerificationComponent implements OnInit {
  currentDate = new Date();
  columnhead:any= ['Srno','Job Number','Job Description','Job Reff','UNQ ESIGN ID','Total Pe'];
  columHederMain:any = ['Srno','Job Number','Description','Pcs','Scanned Pcs','Difference Pcs','']
  constructor(private activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
