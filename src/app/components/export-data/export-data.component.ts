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
  hayDatosEnTabla = signal<boolean>(false);

  private dbService = inject(SqliteService);

  constructor() {
    this.verificarSiHayDatos();
  }

  async verificarSiHayDatos(): Promise<void> {
    try {
      const tieneDatos = await this.dbService.hayDatos(); // cambia el nombre si tu tabla se llama diferente
      this.hayDatosEnTabla.set(tieneDatos);
    } catch (error) {
      console.error('Error al verificar datos en la tabla:', error);
      this.hayDatosEnTabla.set(false);
    }
  }

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
      console.log('-----------------Nombre del archivo de salida:', nombreArchivoSalida);

      // Compartir el archivo
      var resShare = await Share.share({
        title: nombreArchivoSalida,
        text: contenido,
        dialogTitle: 'Compartir archivo',
      });

      console.log('-----------------Resultado de compartir:', JSON.stringify(resShare, null, 2));

      await this.borrarDatos();

      return;

    } catch (error) {
      await Toast.show({ text: 'No se realizó la transferencia de datos' });
    }
  }

  async borrarDatos(): Promise<void> {
    try {
      await this.dbService.deleteData();
      await Toast.show({ text: 'Datos eliminados correctamente.' });
      //await this.verificarSiHayDatos(); // ✅ actualiza el estado del botón
    } catch (error) {
      await Toast.show({ text: 'Error al borrar los datos.' });
    }
  }
}
