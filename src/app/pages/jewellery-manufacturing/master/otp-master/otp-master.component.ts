import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-otp-master',
  templateUrl: './otp-master.component.html',
  styleUrls: ['./otp-master.component.scss']
})
export class OtpMasterComponent implements OnInit {

  columnheader:any[] = ['S.No','Level','User', 'Mobile Number','Mobile Number','Email'];

  constructor( 
    private activeModal: NgbActiveModal,
    ) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
