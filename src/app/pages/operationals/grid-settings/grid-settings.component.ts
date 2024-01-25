import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {

  columnhead: any[] = ['Field Name','Caption','Width','Format','Alignment','Display Order','Is Visible','Is Mandatory','Show Summary','Sum Type'];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,

  ) { }

  gridSettingsForm: FormGroup = this.formBuilder.group({
    selectVocType:[''],
    mainVocType:[''],
    mainVocTypeCode:[''],
    copyToAllBranch:[''],
  })

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }
}
