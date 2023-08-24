import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxComponent implements OnInit {

  title: String = '';
  msg: String = '';
  btnTitle: String = '';
  okBtn: boolean;
  swapColor: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.title = this.data.title;
    this.msg = this.data.msg;
    this.okBtn = this.data.okBtn;
    this.swapColor = this.data.swapColor;
  }

  ngOnInit(): void {

  }

  submit(values:any) {
    this.dialogRef.close(values);
  }
}
