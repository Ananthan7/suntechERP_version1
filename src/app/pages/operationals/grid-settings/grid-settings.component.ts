import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss']
})
export class GridSettingsComponent implements OnInit {

  columnhead: any[] = ['Field Name','Caption','Width','Format','Alignment','Display Order','Is Visible','Is Mandatory','Show Summary','Sum Type'];
  vocTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 88,
    SEARCH_FIELD: 'VOCTYPE',
    SEARCH_HEADING: 'Voucher Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "VOCTYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
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

  vocTypeSelected(event:any){
    console.log(event);
    
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){

  }
}
