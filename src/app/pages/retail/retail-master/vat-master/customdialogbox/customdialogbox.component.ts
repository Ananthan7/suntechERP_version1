import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-customdialogbox",
  templateUrl: "./customdialogbox.component.html",
  styleUrls: ["./customdialogbox.component.scss"],
})
export class CustomdialogboxComponent implements OnInit {
  title: String = "";
  msg: String = "";
  btnTitle: String = "";
  okBtn: boolean;
  clBtn: boolean;
  swapColor: boolean;

  constructor(
    public dialogRef: MatDialogRef<CustomdialogboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.title;
    this.msg = this.data.msg;
    this.okBtn = this.data.okBtn;
    this.clBtn = this.data.clBtn
    this.swapColor = this.data.swapColor;
  }

  ngOnInit(): void {}

  submit(values: any) {
    this.dialogRef.close(values);
  }

  cancel(values: any) {
    this.dialogRef.close(values);
  }
}
