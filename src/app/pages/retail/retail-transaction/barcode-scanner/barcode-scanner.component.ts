import { Component, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent {

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner!: BarcodeScannerLivestreamComponent;

  @Output() barcodeDetected = new EventEmitter<string>();
  @Output() closeRequested = new EventEmitter<void>();

  barcodeValue: any;

  ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  onValueChanges(result: any) {
    this.barcodeValue = result.codeResult.code;
    this.barcodeDetected.emit(this.barcodeValue);
  }

  onStarted(started: any) {
    console.log(started);
  }

  closeScanner() {
    this.closeRequested.emit();
  }
}
