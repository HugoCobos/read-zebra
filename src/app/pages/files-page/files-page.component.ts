import { Component, inject, signal } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';
import { SqliteService } from '../../database/sqlite.service';
import { TableDataComponent } from '../../components/table-data/table-data.component';

@Component({
  selector: 'app-files-page',
  templateUrl: './files-page.component.html',
  imports: [TableDataComponent],
})
export default class FilesPageComponent {
  fileStatus: string | null = null;
  productos = signal<any[]>([]);
  mostrarTabla = signal(false);

  loading = signal(true);

  private fileService = inject(FileUploadService);
  private dbService = inject(SqliteService);

  async ngOnInit() {
    const data = await this.dbService.getAllData();
    this.productos.set(data);
    this.loading.set(false);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      this.fileStatus = 'Por favor, seleccione un archivo primero.';
      return;
    }

    try {
      this.fileStatus = 'Procesando archivo...';

      const productos = await this.fileService.cargarArchivo(file);

      await this.dbService.saveData(productos);
      this.productos.set(await this.dbService.getAllData());

      this.fileStatus = 'Datos guardados correctamente en la base local.';
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      this.fileStatus = 'Hubo un error al procesar el archivo.';
    }
  }

  toggleTablaProductos() {
    this.mostrarTabla.update((prev) => !prev);
  }
}
