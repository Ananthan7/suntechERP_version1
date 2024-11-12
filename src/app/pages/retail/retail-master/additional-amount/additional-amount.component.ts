import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-additional-amount',
  templateUrl: './additional-amount.component.html',
  styleUrls: ['./additional-amount.component.scss']
})
export class AdditionalAmountComponent implements OnInit {

  @ViewChild("overlayDesignCode")
  overlayDesignCode!: MasterSearchComponent;

  typeList:any

  designCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 16,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "DESIGN",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  costAndPriceTypeMainForm: FormGroup = this.formBuilder.group({});


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "design":
        this.overlayDesignCode.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  lookupCodeSelected(e: any, fieldName: any) {
    this.costAndPriceTypeMainForm.controls.design.setValue(e.CODE);
  }
}
