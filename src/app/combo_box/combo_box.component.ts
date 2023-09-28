import { Component, OnInit, Input } from '@angular/core';
import { MapperService } from '../app.service';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo_box.component.html',
  styleUrls: ['./combo_box.component.css']
})
export class ComboBoxComponent implements OnInit {

  @Input() list: string[] = [];
  @Input() fieldid:string = "";
  // two way binding for input text
  inputItem = '';
  // enable or disable visiblility of dropdown
  listHidden = true;
  showError = false;
  selectedIndex = -1;

  // the list to be shown after filtering
  filteredList: string[] = [];

  constructor(private mapperSvc:MapperService) { }

  ngOnInit() {

    this.filteredList = this.list;
  }

  // modifies the filtered list as per input
  getFilteredList() {

    this.listHidden = false;
    // this.selectedIndex = 0;
    if (!this.listHidden && this.inputItem !== undefined) {
      if(this.selectedIndex >-1){
        this.filteredList = this.list.filter((item) => item.toLowerCase()!==this.inputItem.toLowerCase());
      }else{

        this.filteredList = this.list.filter((item) => item.toLowerCase().indexOf(this.inputItem.toLowerCase()) >= 0);
      }
    }
  }

  // select highlighted item when enter is pressed or any item that is clicked
  selectItem(ind:any) {
    this.inputItem = this.filteredList[ind];
    this.listHidden = true;
    this.selectedIndex = ind;
    // this.mapperSvc.setMap(document.getElementById(this.fieldid)!.id,document.getElementById(this.fieldid)!.getAttribute("ng-reflect-model")!)
  }

  // navigate through the list of items
  onKeyPress(event:KeyboardEvent) {
    if (!this.listHidden) {
      if (event.key === 'Escape') {
        this.selectedIndex = -1;
        this.toggleListDisplay(0);
      }

      if (event.key === 'Enter') {

        this.toggleListDisplay(0);
      }
      if (event.key === 'ArrowDown') {

        this.listHidden = false;
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
        if (this.filteredList.length > 0 && !this.listHidden) {
          document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
        }
      } else if (event.key === 'ArrowUp') {

        this.listHidden = false;
        if (this.selectedIndex <= 0) {
          this.selectedIndex = this.filteredList.length;
        }
        this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;

        if (this.filteredList.length > 0 && !this.listHidden) {

          document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
        }
      }
    } 
  }

  // show or hide the dropdown list when input is focused or moves out of focus
  toggleListDisplay(sender: number) {

    if (sender === 1) {
      // this.selectedIndex = -1;
      this.listHidden = false;
      this.getFilteredList();
    } else {
      // helps to select item by clicking
      setTimeout(() => {
        this.selectItem(this.selectedIndex);
        this.listHidden = true;
        if (!this.list.includes(this.inputItem)) {
          this.showError = true;
          this.filteredList = this.list;
        } else {
          this.showError = false;
        }
      }, 500);
    }
  }
}