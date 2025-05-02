import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-data',
  imports: [],
  templateUrl: './table-data.component.html',
})
export class TableDataComponent {
  productos = input<any[]>([]);
}
