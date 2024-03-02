import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.scss']
})
export class JournalVoucherComponent implements OnInit {
  viewMode: boolean = false;
  branchList: any[] = [];
  tableData: any[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.viewMode = true;

  }
  journalVoucherForm: FormGroup = this.formBuilder.group({
    branch: [''],
    From: [''],
    To: [''],
    orderedBy: [''],
    trans:['']
  });

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  dateChange(event: any, flag?: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.journalVoucherForm.controls.VocDate.setValue(new Date(date));
    }
  }
}
