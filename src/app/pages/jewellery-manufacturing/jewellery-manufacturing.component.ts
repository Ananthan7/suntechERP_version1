import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-jewellery-manufacturing',
  templateUrl: './jewellery-manufacturing.component.html',
  styleUrls: ['./jewellery-manufacturing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JewelleryManufacturingComponent implements OnInit {
  menuTitle: any;
  branchCode: any;
  constructor(
    public dataService: SuntechAPIService,
    private CommonService: CommonServiceService,
    private ChangeDetector: ChangeDetectorRef
  ) {
  }
  data: any;
  dataPie: any;

  options: any;

  ngOnInit(): void {
    //use: to get menu title from queryparams
    this.menuTitle = this.CommonService.getTitleName()

    this.setChartData()
  }
  setChartData(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Dataset 1',
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          yAxisID: 'y',
          tension: 0.4,
          data: [65, 59, 80, 81, 56, 55, 10]
        },
        {
          label: 'Dataset 2',
          fill: false,
          borderColor: 'skyblue',
          yAxisID: 'y1',
          tension: 0.4,
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
    this.dataPie = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Dataset 1',
          fill: false,
          yAxisID: 'y',
          data: [65, 59, 80, 81, 56, 55, 10]
        },
      ]
    };
    this.options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          display: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder
          }
        }
      }
    };
  }
  menuClicked(event: any) {
    this.menuTitle = event.MENU_MODULE
  }
}
