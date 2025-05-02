import { inject, Injectable } from '@angular/core';
import { TextFileService } from './text-file.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private textFileService = inject(TextFileService);

  async cargarArchivo(file: File): Promise<any[]> {
    // 1. Leer el archivo como texto
    const contenido = await this.textFileService.readTextFile(file);

    // 2. Parsear a array de objetos
    const productos = this.textFileService.parseCsvText(contenido);

    return productos;
  }
}
