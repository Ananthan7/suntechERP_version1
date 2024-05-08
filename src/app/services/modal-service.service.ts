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
    this.dialogBox = this.dialog.open(DialogboxComponent, {
        width: '40%',
        disableClose: true,
        data: { title, msg, okBtn, swapColor },
    });
}


public async exportToPdf(htmlContent: string, fileName: string): Promise<void> {
  const element = document.createElement('div');
  element.innerHTML = htmlContent;

  const images = Array.from(element.getElementsByTagName('img')).map(img => img.src);
  const base64Images = await this.convertImagesToBase64(images);

  Array.from(element.getElementsByTagName('img')).forEach(img => {
    img.src = base64Images[img.src];
  });

  const options = {
    margin: 1,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { dpi: 192, letterRendering: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
  };

  html2pdf().from(element).set(options).save();
}

private convertImagesToBase64(images: string[]): Promise<{ [key: string]: string }> {
  return Promise.all(images.map(this.toBase64)).then(base64Strings => {
    const base64Map: { [key: string]: string } = {};
    images.forEach((url, index) => {
      base64Map[url] = base64Strings[index];
    });
    return base64Map;
  });
}

private toBase64(url: string): Promise<string> {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}
}