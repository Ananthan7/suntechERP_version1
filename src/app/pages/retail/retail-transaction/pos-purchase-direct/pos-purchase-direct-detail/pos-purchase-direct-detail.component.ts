import { Component, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-pos-purchase-direct-detail',
  templateUrl: './pos-purchase-direct-detail.component.html',
  styleUrls: ['./pos-purchase-direct-detail.component.scss']
})
export class PosPurchaseDirectDetailComponent implements OnInit {

  posPurchaseDirectDetailForm: FormGroup = this.formBuilder.group({
  })

  constructor( private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,private modalService: NgbModal,) { }

    ngOnInit(): void {
    }
    close(data?: any) {
      //TODO reset forms and data before closing
      this.activeModal.close(data);
    }
}
