import { Component, inject, signal } from '@angular/core';
import { SqliteService } from '../../database/sqlite.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

declare var bootstrap: any;

@Component({
  selector: 'app-export-data',
  imports: [],
  templateUrl: './export-data.component.html',
})
export class ExportDataComponent {
  fileName = signal<string>('');

  private dbService = inject(SqliteService);

  async exportarTxt(): Promise<void> {
    try {
      const productos = await this.dbService.getAllData();

      if (productos.length === 0) {
        await Toast.show({ text: 'No hay productos para exportar.' });
        return;
      }

      const contenido = productos
        .map((p) =>
          [
            p.codigo_producto,
            p.referencia,
            p.descripcion,
            p.unidad_medida,
            p.cantidad_stock,
            p.valor_adicional,
          ].join(',')
        )
        .join('\n');

      this.fileName.set(`productos_${this.generateStringRandom()}.txt`);
      // const fileName = `productos.txt`;

      await Filesystem.writeFile({
        path: this.fileName(),
        data: contenido,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      // await Toast.show({ text: `Archivo guardado como ${fileName}` });

      const modalElement = document.getElementById('confirmDeleteModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } catch (error) {
      console.error('Error al exportar archivo:', error);
      await Toast.show({ text: 'Error al exportar los datos.' });
    }
  }

  generateStringRandom(longitud: number = 5): string {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indice);
    }
    return resultado;
  }

  async borrarDatos(): Promise<void> {
    try {
      await this.dbService.deleteData(); // Asegúrate de tener este método en tu servicio
      await Toast.show({ text: 'Datos eliminados correctamente.' });

      // Cierra el modal manualmente
      const modalElement = document.getElementById('confirmDeleteModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
    } catch (error) {
      console.error('Error al borrar los datos:', error);
      await Toast.show({ text: 'Error al borrar los datos.' });
    }
  }
}
