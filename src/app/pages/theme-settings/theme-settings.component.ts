import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {
  color: string = '#3599CC';
  NavMenucolor: string = '#3599CC';
  NavMenuItemcolor: string = '#24566B';
  displayNamecolor: string = '#1E232C';
  chartNamecolor: string = '#1E232C';
  tableColheadcolor: string = '#D5F2FF';
  xaxisLabelcolor: string = '#D5F2FF';
  YaxisLabelcolor: string = '#D5F2FF';
  chartLabelcolor: string = '#1E232C';
  toolTipcolor: string = '#1E232C';
  legendscolor: string = '#1E232C';
  buttoncolor: string = '#1E232C';
  filterHeadcolor: string = '#24566B';
  filterValuecolor: string = '#D5F2FF';
  selectedtheme:any
  themeSelected:any
  typography:any
  selectedtypography:any
  filterpanel:any
  filterPanelSelected:any
  sections:any[] = [
    {name: 'Dashboard Navigation Menu', code: 1},
    {name: 'Dashboard Navigation Menu Item', code: 2},
    {name: 'Dashboard Display Name', code: 3},
    {name: 'Report / Chart Display Name', code: 4},
    {name: 'Table Column Header', code: 5},
    {name: 'X Axis Labels', code: 6},
    {name: 'Y Axis Labels', code: 7},
    {name: 'Chart Labels', code: 8},
    {name: 'Tooltips', code: 9},
    {name: 'Legends', code: 10},
  ];
  font:any[] = [
    {name: '10', code: 1},
    {name: '11', code: 2},
    {name: '12', code: 3},
    {name: '16', code: 4},
  ];
  fontcolor:any[] = [
    {name: '#3599CC', code: 1},
    {name: '#24566B', code: 2},
    {name: '#1E232C', code: 3},
    {name: '#D5F2FF', code: 4},
  ];
  filterPanel:any[] = [
    {name: 'Filter Header', code: 1},
    {name: 'Filter Value', code: 2},
   
  ];
  themes:any[] = [
    {name: 'Light', code: 1},
    {name: 'Dark', code: 2},
    {name: 'Custom', code: 3},
  ];
    /** form validations */
    ButtonForm = this.fb.group({
      buttonFont: [3, [Validators.required]],
      buttonFontsize: [3, [Validators.required]],
      buttonfontcolor: [3, [Validators.required]],
    })
    /** form validations */
    FilterPanelForm = this.fb.group({
      filterpanel: [1, [Validators.required]],
      filterHeadFont: [1, [Validators.required]],
      filterHeadFontsize: [3, [Validators.required]],
      filterHeadfontcolor: [3, [Validators.required]],
      filterValueFont: [3, [Validators.required]],
      filterValueFontsize: [3, [Validators.required]],
      filterValuefontcolor: [3, [Validators.required]],
    })
    /** form validations */
    typographyForm = this.fb.group({
      typo: [1, [Validators.required]],
      NavMenuFont: [1, [Validators.required]],
      NavMenuFontsize: [1, [Validators.required]],
      NavMenufontcolor: [1, [Validators.required]],
      NavMenuItemFont: [2, [Validators.required]],
      NavMenuItemFontsize: [2, [Validators.required]],
      NavMenuItemfontcolor: [2, [Validators.required]],
      displayNameFont: [3, [Validators.required]],
      displayNameFontsize: [3, [Validators.required]],
      displayNamefontcolor: [3, [Validators.required]],
      chartNameFont: [3, [Validators.required]],
      chartNameFontsize: [3, [Validators.required]],
      chartNamefontcolor: [3, [Validators.required]],
      tableColheadFont: [4, [Validators.required]],
      tableColheadFontsize: [4, [Validators.required]],
      tableColheadfontcolor: [4, [Validators.required]],
      xaxisLabelFont: [4, [Validators.required]],
      xaxisLabelFontsize: [4, [Validators.required]],
      xaxisLabelfontcolor: [4, [Validators.required]],
      YaxisLabelFont: [4, [Validators.required]],
      YaxisLabelFontsize: [4, [Validators.required]],
      YaxisLabelfontcolor: [4, [Validators.required]],
      chartLabelFont: [3, [Validators.required]],
      chartLabelFontsize: [3, [Validators.required]],
      chartLabelfontcolor: [3, [Validators.required]],
      toolTipFont: [3, [Validators.required]],
      toolTipFontsize: [3, [Validators.required]],
      toolTipfontcolor: [3, [Validators.required]],
      legendsFont: [3, [Validators.required]],
      legendsFontsize: [3, [Validators.required]],
      legendsfontcolor: [3, [Validators.required]],
    })
    
  constructor(
    private fb: FormBuilder
  ) {
    this.themeSelected = this.themes[0].code
    this.selectedtheme = 1
    this.typography = this.sections[0].name
    this.selectedtypography = 1
    this.filterpanel = this.filterPanel[0].name
    this.filterPanelSelected = 1
  }

  ngOnInit(): void {
  }
  saveData(){

  }
  //typography main select change
  selecttypo(item:any){
    this.selectedtypography = item.code
  }
  selectNavMenuColor(item:any){
    this.NavMenucolor = item.name
  }
  selectNavMenuItemColor(item:any){
    this.NavMenuItemcolor = item.name
  }
  selectdisplayNameColor(item:any){
    this.displayNamecolor = item.name
  }
  selectchartNameColor(item:any){
    this.chartNamecolor = item.name
  }
  selecttableColheadColor(item:any){
    this.tableColheadcolor = item.name
  }
  selectxaxisLabelColor(item:any){
    this.xaxisLabelcolor = item.name
  }
  selectYaxisLabelColor(item:any){
    this.YaxisLabelcolor = item.name
  }
  selectchartLabelColor(item:any){
    this.chartLabelcolor = item.name
  }
  selecttoolTipColor(item:any){
    this.toolTipcolor = item.name
  }
  selectlegendsColor(item:any){
    this.legendscolor = item.name
  }
  selectbuttonColor(item:any){
    this.buttoncolor = item.name
  }
  selectfilterHeadColor(item:any){
    this.filterHeadcolor = item.name
  }
  selectfilterValueColor(item:any){
    this.filterValuecolor = item.name
  }

  selectTheme(item:any){
    this.selectedtheme = item.code
  }
 
  selectfilterPanel(item:any){
    this.filterPanelSelected = item.code
  }
}
