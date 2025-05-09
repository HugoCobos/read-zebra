import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-data',
  imports: [],
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.css',
})
export class TableDataComponent {
  productos = input<any[]>([]);
}
