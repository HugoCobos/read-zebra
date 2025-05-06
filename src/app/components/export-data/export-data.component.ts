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

        const nombreArchivoSalida = await this.dbService.getNombreArchivoSalida();
        if (!nombreArchivoSalida) {
          await Toast.show({ text: 'No se pudo determinar el nombre del archivo.' });
          return;
        }
        this.fileName.set(nombreArchivoSalida);
      // const fileName = `productos.txt`;

      await Filesystem.writeFile({
        path: this.fileName(),
        data: contenido,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      await Toast.show({ text: `Archivo guardado como ${this.fileName()}` });
      
      await this.borrarDatos();

    } catch (error) {
      console.error('Error al exportar archivo:', error);
      await Toast.show({ text: 'Error al exportar los datos.' });
    }
  }

  async borrarDatos(): Promise<void> {
    try {
      await this.dbService.deleteData(); // Asegúrate de tener este método en tu servicio
      await Toast.show({ text: 'Datos eliminados correctamente.' });

      // // Cierra el modal manualmente
      // const modalElement = document.getElementById('confirmDeleteModal');
      // if (modalElement) {
      //   const modal = bootstrap.Modal.getInstance(modalElement);
      //   modal?.hide();
      // }
    } catch (error) {
      console.error('Error al borrar los datos:', error);
      await Toast.show({ text: 'Error al borrar los datos.' });
    }
  }
}
