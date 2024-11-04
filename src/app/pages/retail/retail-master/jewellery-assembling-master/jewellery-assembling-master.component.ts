import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-jewellery-assembling-master",
  templateUrl: "./jewellery-assembling-master.component.html",
  styleUrls: ["./jewellery-assembling-master.component.scss"],
})
export class JewelleryAssemblingMasterComponent implements OnInit {

  @ViewChild("tabGroup") tabGroup!: MatTabGroup;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave () {

  }

  deleteMaster() {

  }
}
