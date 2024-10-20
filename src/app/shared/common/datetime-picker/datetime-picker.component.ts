import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModel } from '../../data/datetime-model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss']
})
export class DatetimePickerComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true }) dataGrid!: DxDataGridComponent;
  @ViewChild('overlayPanel') overlayPanels!: OverlayPanel
  @ViewChild('dropdown') dropDown!: NgbDropdown;
  @Output() datetimeClick = new EventEmitter();
  @Input() DateTimeModelData!: DateTimeModel;
  isLoading: boolean = false;
  @Input() content!: any;
  @Input() durationToSplit!: any;
  @Input() viewMode: boolean = false;


  @Output() updateDuration = new EventEmitter<any>();
  durationPickerForm!: FormGroup;

  duration: any[] = [];
  totalMinutes: any;
  daystime: any;
  hoursTime: any;
  minutesTime: any;
  daystime2: any;
  hoursTime2: any;
  minutesTime2: any;
  //viewMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
  ) { }
  
  ngOnInit(): void {
    this.durationPickerForm = this.formBuilder.group({
      days:[this.days[0].value],
      hours: [this.minutes[0].value],
      minutes: [this.seconds[0].value],
    });
    this.setInitialTime()
  }
  showOverlayPanel(event?: Event) {
    this.setInitialTime()
    this.dropDown.open()
    // this.overlayPanels.show(event);
  }
  setInitialTime(){
    if (this.commonService.emptyToZero(this.DateTimeModelData?.TIMEINMINUTES) != 0) {
      this.timeConvert(this.DateTimeModelData.TIMEINMINUTES);
      this.durationPickerForm.controls.days.setValue(this.daystime);
      this.durationPickerForm.controls.hours.setValue(this.hoursTime);
      this.durationPickerForm.controls.minutes.setValue(this.minutesTime);
    }
  }
  dorpdownToggle(event: any) {
 
  }

  onHidePanel() {
  }
  closeOverlayPanel() {
    // this.overlayPanels.hide();
    this.dropDown.close()
  }
  //handle Row Click of table
  handleRowClick(event: any) {
    this.datetimeClick.emit(event)
    this.closeOverlayPanel()
    // this.dropDown.close()
  }

  timeConvert(time: any) {
    const daysTime = Math.floor(time / 24 / 60);
    const hoursTime = Math.floor(time / 60 % 24);
    const minutesTime = Math.floor(time % 60);

    this.daystime = daysTime
    this.hoursTime = hoursTime
    this.minutesTime = minutesTime

    return daysTime + ":" + hoursTime + ':' + minutesTime;
  }

  // timeConvert1(time: any) {
  //   const daysTime = Math.floor(time / 24 / 60);
  //   const hoursTime = Math.floor(time / 60 % 24);
  //   const minutesTime = Math.floor(time % 60);

  //   this.daystime2 = daysTime
  //   this.hoursTime2 = hoursTime
  //   this.minutesTime2 = minutesTime

  //   return daysTime + ":" + hoursTime + ':' + minutesTime;
  // }

  getDays(e: any) {
    this.handleDurationUpdate(e, 0, 24 * 60);
    this.setDateTimeString(e);
  }

  getHours(e: any) {
    this.handleDurationUpdate(e, 1, 60);
    this.setDateTimeString(e);
  }

  getMinutes(e: any) {
    this.handleDurationUpdate(e, 2, 1);
    this.setDateTimeString(e);
  }

  private setDateTimeString(e: any) {
    let days = this.commonService.nullToString(this.durationPickerForm.value.days);
    let hours = this.commonService.nullToString(this.durationPickerForm.value.hours);
    let minutes = this.commonService.nullToString(this.durationPickerForm.value.minutes);
    let timeString = days.toString().padStart(2, '0')+':'+
    hours.toString().padStart(2, '0')+':'+minutes.toString().padStart(2, '0')
    
    this.datetimeClick.emit(timeString);
  }
  private handleDurationUpdate(e: any, index: number, multiplier: number) {
    this.duration[index] = e.name;

    this.totalMinutes = this.duration.reduce((acc, val, i) => acc + (parseInt(val) * (i === 0 ? 24 * 60 : i === 1 ? 60 : 1)), 0);

    this.emitUpdatedDuration();
  }

  private emitUpdatedDuration() {
    this.updateDuration.emit(this.totalMinutes);
  }
  days: any[] = [
    {
      "name": '00',
      "value": 0
    },
    {
      "name": '01',
      "value": 1
    },
    {
      "name": '02',
      "value": 2
    },
    {
      "name": '03',
      "value": 3
    },
    {
      "name": '04',
      "value": 4
    },
    {
      "name": '05',
      "value": 5
    },
    {
      "name": '06',
      "value": 6
    },
    {
      "name": '07',
      "value": 7
    },
    {
      "name": '08',
      "value": 8
    },
    {
      "name": '09',
      "value": 9
    },
    {
      "name": 10,
      "value": 10
    },
    {
      "name": 11,
      "value": 11
    },
    {
      "name": 12,
      "value": 12
    },
    {
      "name": 13,
      "value": 13
    },
    {
      "name": 14,
      "value": 14
    },
    {
      "name": 15,
      "value": 15
    },
    {
      "name": 16,
      "value": 16
    },
    {
      "name": 17,
      "value": 17
    },
    {
      "name": 18,
      "value": 18
    },
    {
      "name": 19,
      "value": 19
    },
    {
      "name": 20,
      "value": 20
    },
    {
      "name": 21,
      "value": 21
    },
    {
      "name": 22,
      "value": 22
    },
    {
      "name": 23,
      "value": 23
    },
    {
      "name": 24,
      "value": 24
    },
    {
      "name": 25,
      "value": 25
    },
    {
      "name": 26,
      "value": 26
    },
    {
      "name": 27,
      "value": 27
    },
    {
      "name": 28,
      "value": 28
    },
    {
      "name": 29,
      "value": 29
    },
    {
      "name": 30,
      "value": 30
    },
    {
      "name": 31,
      "value": 31
    },
    {
      "name": 32,
      "value": 32
    },
    {
      "name": 33,
      "value": 33
    },
    {
      "name": 34,
      "value": 34
    },
    {
      "name": 35,
      "value": 35
    },
    {
      "name": 36,
      "value": 36
    },
    {
      "name": 37,
      "value": 37
    },
    {
      "name": 38,
      "value": 38
    },
    {
      "name": 39,
      "value": 39
    },
    {
      "name": 40,
      "value": 40
    },
    {
      "name": 41,
      "value": 41
    },
    {
      "name": 42,
      "value": 42
    },
    {
      "name": 43,
      "value": 43
    },
    {
      "name": 44,
      "value": 44
    },
    {
      "name": 45,
      "value": 45
    },
    {
      "name": 46,
      "value": 46
    },
    {
      "name": 47,
      "value": 47
    },
    {
      "name": 48,
      "value": 48
    },
    {
      "name": 49,
      "value": 49
    },
    {
      "name": 50,
      "value": 50
    },
    {
      "name": 51,
      "value": 51
    },
    {
      "name": 52,
      "value": 52
    },
    {
      "name": 53,
      "value": 53
    },
    {
      "name": 54,
      "value": 54
    },
    {
      "name": 55,
      "value": 55
    },
    {
      "name": 56,
      "value": 56
    },
    {
      "name": 57,
      "value": 57
    },
    {
      "name": 58,
      "value": 58
    },
    {
      "name": 59,
      "value": 59
    },
    {
      "name": 60,
      "value": 60
    },
    {
      "name": 61,
      "value": 61
    },
    {
      "name": 62,
      "value": 62
    },
    {
      "name": 63,
      "value": 63
    },
    {
      "name": 64,
      "value": 64
    },
    {
      "name": 65,
      "value": 65
    },
    {
      "name": 66,
      "value": 66
    },
    {
      "name": 67,
      "value": 67
    },
    {
      "name": 68,
      "value": 68
    },
    {
      "name": 69,
      "value": 69
    },
    {
      "name": 70,
      "value": 70
    },
    {
      "name": 71,
      "value": 71
    },
    {
      "name": 72,
      "value": 72
    },
    {
      "name": 73,
      "value": 73
    },
    {
      "name": 74,
      "value": 74
    },
    {
      "name": 75,
      "value": 75
    },
    {
      "name": 76,
      "value": 76
    },
    {
      "name": 77,
      "value": 77
    },
    {
      "name": 78,
      "value": 78
    },
    {
      "name": 79,
      "value": 79
    },
    {
      "name": 80,
      "value": 80
    },
    {
      "name": 81,
      "value": 81
    },
    {
      "name": 82,
      "value": 82
    },
    {
      "name": 83,
      "value": 83
    },
    {
      "name": 84,
      "value": 84
    },
    {
      "name": 85,
      "value": 85
    },
    {
      "name": 86,
      "value": 86
    },
    {
      "name": 87,
      "value": 87
    },
    {
      "name": 88,
      "value": 88
    },
    {
      "name": 89,
      "value": 89
    },
    {
      "name": 90,
      "value": 90
    },
    {
      "name": 91,
      "value": 91
    },
    {
      "name": 92,
      "value": 92
    },
    {
      "name": 93,
      "value": 93
    },
    {
      "name": 94,
      "value": 94
    },
    {
      "name": 95,
      "value": 95
    },
    {
      "name": 96,
      "value": 96
    },
    {
      "name": 97,
      "value": 97
    },
    {
      "name": 98,
      "value": 98
    },
    {
      "name": 99,
      "value": 99
    }
  ];

  minutes: any[] = [
    {
      "name": '00',
      "value": 0
    },
    {
      "name": '01',
      "value": 1
    },
    {
      "name": '02',
      "value": 2
    },
    {
      "name": '03',
      "value": 3
    },
    {
      "name": '04',
      "value": 4
    },
    {
      "name": '05',
      "value": 5
    },
    {
      "name": '06',
      "value": 6
    },
    {
      "name": '07',
      "value": 7
    },
    {
      "name": '08',
      "value": 8
    },
    {
      "name": '09',
      "value": 9
    },
    {
      "name": 10,
      "value": 10
    },
    {
      "name": 11,
      "value": 11
    },
    {
      "name": 12,
      "value": 12
    },
    {
      "name": 13,
      "value": 13
    },
    {
      "name": 14,
      "value": 14
    },
    {
      "name": 15,
      "value": 15
    },
    {
      "name": 16,
      "value": 16
    },
    {
      "name": 17,
      "value": 17
    },
    {
      "name": 18,
      "value": 18
    },
    {
      "name": 19,
      "value": 19
    },
    {
      "name": 20,
      "value": 20
    },
    {
      "name": 21,
      "value": 21
    },
    {
      "name": 22,
      "value": 22
    },
    {
      "name": 23,
      "value": 23
    }
  ];

  seconds: any[] = [
    {
      "name": '00',
      "value": 0
    },
    {
      "name": '01',
      "value": 1
    },
    {
      "name": '02',
      "value": 2
    },
    {
      "name": '03',
      "value": 3
    },
    {
      "name": '04',
      "value": 4
    },
    {
      "name": '05',
      "value": 5
    },
    {
      "name": '06',
      "value": 6
    },
    {
      "name": '07',
      "value": 7
    },
    {
      "name": '08',
      "value": 8
    },
    {
      "name": '09',
      "value": 9
    },
    {
      "name": 10,
      "value": 10
    },
    {
      "name": 11,
      "value": 11
    },
    {
      "name": 12,
      "value": 12
    },
    {
      "name": 13,
      "value": 13
    },
    {
      "name": 14,
      "value": 14
    },
    {
      "name": 15,
      "value": 15
    },
    {
      "name": 16,
      "value": 16
    },
    {
      "name": 17,
      "value": 17
    },
    {
      "name": 18,
      "value": 18
    },
    {
      "name": 19,
      "value": 19
    },
    {
      "name": 20,
      "value": 20
    },
    {
      "name": 21,
      "value": 21
    },
    {
      "name": 22,
      "value": 22
    },
    {
      "name": 23,
      "value": 23
    },
    {
      "name": 24,
      "value": 24
    },
    {
      "name": 25,
      "value": 25
    },
    {
      "name": 26,
      "value": 26
    },
    {
      "name": 27,
      "value": 27
    },
    {
      "name": 28,
      "value": 28
    },
    {
      "name": 29,
      "value": 29
    },
    {
      "name": 30,
      "value": 30
    },
    {
      "name": 31,
      "value": 31
    },
    {
      "name": 32,
      "value": 32
    },
    {
      "name": 33,
      "value": 33
    },
    {
      "name": 34,
      "value": 34
    },
    {
      "name": 35,
      "value": 35
    },
    {
      "name": 36,
      "value": 36
    },
    {
      "name": 37,
      "value": 37
    },
    {
      "name": 38,
      "value": 38
    },
    {
      "name": 39,
      "value": 39
    },
    {
      "name": 40,
      "value": 40
    },
    {
      "name": 41,
      "value": 41
    },
    {
      "name": 42,
      "value": 42
    },
    {
      "name": 43,
      "value": 43
    },
    {
      "name": 44,
      "value": 44
    },
    {
      "name": 45,
      "value": 45
    },
    {
      "name": 46,
      "value": 46
    },
    {
      "name": 47,
      "value": 47
    },
    {
      "name": 48,
      "value": 48
    },
    {
      "name": 49,
      "value": 49
    },
    {
      "name": 50,
      "value": 50
    },
    {
      "name": 51,
      "value": 51
    },
    {
      "name": 52,
      "value": 52
    },
    {
      "name": 53,
      "value": 53
    },
    {
      "name": 54,
      "value": 54
    },
    {
      "name": 55,
      "value": 55
    },
    {
      "name": 56,
      "value": 56
    },
    {
      "name": 57,
      "value": 57
    },
    {
      "name": 58,
      "value": 58
    },
    {
      "name": 59,
      "value": 59
    }
  ];
}


