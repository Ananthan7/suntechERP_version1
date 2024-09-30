import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { DialogboxComponent } from '../shared/common/dialogbox/dialogbox.component';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';



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
    return this.dialog.open(DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }


generatePdf(elementId: string, filename: string): void {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  const options = {
    margin: 1,
    filename: filename,
    image: { type: 'jpeg', quality: 0.99 },
    html2canvas: { dpi: 192, letterRendering: true, useCORS: true },
    jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' }
  };

  // Ensure images are loaded before generating PDF
  const images = element.querySelectorAll('img');
  let imagesLoaded = 0;

  const checkImagesLoaded = () => {
    imagesLoaded++;
    if (imagesLoaded === images.length) {
      html2pdf().from(element).set(options).save();
    }
  };

  images.forEach((img) => {
    img.onload = checkImagesLoaded;
    if (img.complete) {
      checkImagesLoaded();
    }
  });

  // If there are no images, proceed with PDF generation
  if (images.length === 0) {
    html2pdf().from(element).set(options).save();
  }
}
}