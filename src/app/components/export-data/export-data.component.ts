import { Component, inject, signal } from '@angular/core';
import { SqliteService } from '../../database/sqlite.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-export-data',
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
            p.valor_adicional ?? '*',
          ].join(',')
        )
        .join('\n');

      const nombreArchivoSalida = await this.dbService.getNombreArchivoSalida();
      if (!nombreArchivoSalida) {
        await Toast.show({
          text: 'No se pudo determinar el nombre del archivo.',
        });
        return;
      }

      console.log('-----------------Contenido a exportar:', contenido);
      console.log('------------------Nombre del archivo de salida:', nombreArchivoSalida);

     // this.fileName.set(nombreArchivoSalida);

      //await Filesystem.writeFile({
      //  path: this.fileName(),
      //  data: contenido,
//        directory: Directory.Documents,
      //  directory: Directory.Data,
      //  encoding: Encoding.UTF8,
      //});

      //await Toast.show({ text: `Archivo guardado como ${this.fileName()}` });

      // Compartir el archivo
      await Share.share({
        title: nombreArchivoSalida + ' - SALIDA',
        text: contenido,
        dialogTitle: 'Compartir como texto',
      });

      await this.borrarDatos();
      return;
      
    } catch (error) {
      await Toast.show({ text: 'Error al exportar los datos.' });
    }
  }

  async borrarDatos(): Promise<void> {
    try {
      await this.dbService.deleteData();
      await Toast.show({ text: 'Datos eliminados correctamente.' });
    } catch (error) {
      await Toast.show({ text: 'Error al borrar los datos.' });
    }
  }
}
