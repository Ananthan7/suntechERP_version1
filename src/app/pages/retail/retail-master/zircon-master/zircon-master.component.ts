import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: "app-zircon-master",
  templateUrl: "./zircon-master.component.html",
  styleUrls: ["./zircon-master.component.scss"],
})
export class ZirconMasterComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}
  zirconMasterMainForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}


}
