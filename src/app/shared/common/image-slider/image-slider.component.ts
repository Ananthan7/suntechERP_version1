import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss']
})
export class ImageSliderComponent implements OnInit {
  @Input() imageArray:any[] = []
  @Input() width:any = '200px'
  @Input() height:any = '200px'
  constructor() { }

  ngOnInit(): void {
    console.log(this.imageArray);
    
  }

}
