import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { SqliteService } from '../../database/sqlite.service';
import { FormsModule } from '@angular/forms';
import { TableDataComponent } from '../../components/table-data/table-data.component';
import { ProductScanComponent } from '../../components/product-scan/product-scan.component';

@Component({
  selector: 'app-orders-page',
  imports: [FormsModule, TableDataComponent, ProductScanComponent],
  templateUrl: './orders-page.component.html',
})
export default class OrdersPageComponent {
  codigoProducto = signal('');
  producto = signal<any | null | undefined>(undefined); // undefined = sin búsqueda, null = no encontrado

  productos = signal<any[]>([]);
  mostrarTodos = signal(false);

  private sqliteService = inject(SqliteService);

  @ViewChild('txtSearch', { static: true })
  txtSearch!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.txtSearch.nativeElement.focus(); // Establecer foco en el input
  }

  handleSaveCompleted() {
    // Vuelve a hacer foco al input cuando el hijo termina
    setTimeout(() => {
      this.txtSearch.nativeElement.focus();
    });
  }

  // Método para manejar la búsqueda del producto
  async buscarProducto() {
    const codigo = this.codigoProducto().trim();

    if (!codigo) {
      this.producto.set(undefined);
      return;
    }

    try {
      const resultados = await this.sqliteService.getProductAndUpdateStock(
        codigo
      );
      this.producto.set(resultados.length > 0 ? resultados[0] : null);
    } catch (error) {
      this.producto.set(null); // Puedes mostrar un mensaje de error aquí
    }

    // Limpiar el input después de la búsqueda
    this.codigoProducto.set('');
  }

  // Método para alternar entre mostrar todos los productos
  async toggleMostrarTodos() {
    this.mostrarTodos.update((prev) => !prev);
    if (this.mostrarTodos()) {
      const data = await this.sqliteService.getAllData();
      this.productos.set(data);
    }
  }

  // Método para manejar el escaneo directo del código de barras
  codigoProductoEscaneado(codigo: string) {
    this.codigoProducto.set(codigo);
    this.buscarProducto();
  }
}
