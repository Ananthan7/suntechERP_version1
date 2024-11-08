import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-overtime-master',
  templateUrl: './overtime-master.component.html',
  styleUrls: ['./overtime-master.component.scss']
})
export class OvertimeMasterComponent implements OnInit {

  fields = Array.from({ length: 15 }, (_, index) => ({
    label: `User defined ${index + 1}`,
    formControlName: `userDefined${index + 1}`,
  }));


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  overTimeMainForm: FormGroup = this.formBuilder.group({});


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

}
