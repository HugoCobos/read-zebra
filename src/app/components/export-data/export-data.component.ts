import { Component, inject } from '@angular/core';
import { SqliteService } from '../../database/sqlite.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-export-data',
  imports: [],
  templateUrl: './export-data.component.html',
})
export class ExportDataComponent {
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

      const fileName = `productos_${this.generateStringRandom()}.txt`;
      // const fileName = `productos.txt`;

      await Filesystem.writeFile({
        path: fileName,
        data: contenido,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      await Toast.show({ text: `Archivo guardado como ${fileName}` });
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
}
