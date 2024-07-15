import { Component, Output, EventEmitter } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode-scanner.component.html',
  styleUrls: ['./qrcode-scanner.component.scss']
})
export class QrcodeScannerComponent {
  formats = [BarcodeFormat.QR_CODE];

  @Output() qrcodeDetected = new EventEmitter<string>();
  @Output() closeRequested = new EventEmitter<void>();

  handleQrCodeResult(resultString: string) {
    this.qrcodeDetected.emit(resultString);
  }

  closeScanner() {
    this.closeRequested.emit();
  }
}
