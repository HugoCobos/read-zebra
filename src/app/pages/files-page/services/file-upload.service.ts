import { inject, Injectable } from '@angular/core';
import { TextFileService } from './text-file.service';
import { SqliteService } from '../../../database/sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private textFileService = inject(TextFileService);
  
  private sqliteService = inject(SqliteService);

  async cargarArchivo(file: File): Promise<any[]> {
    // 1. Leer el archivo como texto
    const contenido = await this.textFileService.readTextFile(file);

    // 2. Parsear a array de objetos
    const productos = this.textFileService.parseCsvText(contenido);

    // Guardar el nombre del archivo en preferencias
    await this.sqliteService.setNombreArchivoEntrada(file.name);

    return productos;
  }
}
