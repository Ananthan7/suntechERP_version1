import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pcr-selection',
  templateUrl: './pcr-selection.component.html',
  styleUrls: ['./pcr-selection.component.scss']
})
export class PcrSelectionComponent implements OnInit {

  columnhead: any[] = ['Voc No.', 'Voc Date', 'Amount', 'Balance Amount'];
  pcrSelectionData: any[] = [];
  
    constructor(private activeModal: NgbActiveModal) { }
  
    ngOnInit(): void {
    }
  
    close(data?: any) {
      //TODO reset forms and data before closing
      this.activeModal.close(data);
    }
}
