import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-client-authorization",
  templateUrl: "./client-authorization.component.html",
  styleUrls: ["./client-authorization.component.scss"],
})
export class ClientAuthorizationComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  SalesInvoiceMainForm: FormGroup = this.formBuilder.group({});
  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}
  onSelectionChanged(data: any) {
    console.log(data);
  }

  openRepairdetails() {}

  removedata() {}
}
