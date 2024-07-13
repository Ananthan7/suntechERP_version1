import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent {

  @Output() barcodeDetected = new EventEmitter<string>();
  @Output() scannerClosed = new EventEmitter<void>();
  value: string="";
  isError: boolean = false;

  onError(error: any): void {
    console.error('Barcode scan error: ', error);
    this.isError = true;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.barcodeDetected.emit(this.value);
  }

  close(): void {
    this.scannerClosed.emit();
  }
  
}