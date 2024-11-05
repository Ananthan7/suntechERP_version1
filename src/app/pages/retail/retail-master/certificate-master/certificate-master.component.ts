import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-certificate-master",
  templateUrl: "./certificate-master.component.html",
  styleUrls: ["./certificate-master.component.scss"],
})
export class CertificateMasterComponent implements OnInit {
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}
  certificateMasterMainForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}
}
