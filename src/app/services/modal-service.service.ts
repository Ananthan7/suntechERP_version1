import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { DialogboxComponent } from '../shared/common/dialogbox/dialogbox.component';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailService {
  validatePCS!: boolean;
  blockNegativeStock!: any;
  blockMinimumPrice!: any;
  blockMinimumPriceValue!: any;
  lineItemPcs!: any;
  lineItemGrossWt!: any;
  private storedItems = new BehaviorSubject<any[]>([]);
  divisionCode!:string;
  isStoneIncluded:boolean = false;

  isWarningModalOpen = false;
  dialogBox: any;

  constructor(private dialog: MatDialog) { }

  setData(data: any[]) {
    this.storedItems.next(data);
  }

  getData() {
    return this.storedItems.asObservable();
  }

  openWarningModal(onDismiss: () => void) {
    this.isWarningModalOpen = true; 
    this.openDialog(
      'Warning',
      'Are you sure want to close?',
      false
    );
    this.dialogBox.afterClosed().subscribe((result:any) => {
      this.isWarningModalOpen = false;  
      if (result === 'Yes') {
        onDismiss(); 
      } else {
        
      }
    });
  }
  openDialog(title: any, msg: any, okBtn: any, swapColor = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
        width: '40%',
        disableClose: true,
        data: { title, msg, okBtn, swapColor },
    });
}
}