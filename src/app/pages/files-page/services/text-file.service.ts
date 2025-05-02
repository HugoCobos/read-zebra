import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextFileService {
  // Leer archivo como texto
  async readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Parsear texto CSV a objetos
  parseCsvText(content: string): any[] {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [
          codigo_producto = '',
          referencia = '',
          descripcion = '',
          unidad_medida = '',
          cantidad_stock = '0',
          valor_adicional = '0',
        ] = line.split(',');

        return {
          codigo_producto: codigo_producto.trim(),
          referencia: referencia.trim(),
          descripcion: descripcion.trim(),
          unidad_medida: unidad_medida.trim(),
          cantidad_stock: parseInt(cantidad_stock.trim(), 10),
          valor_adicional: parseInt(valor_adicional.trim(), 10),
        };
      });
  }

  // Generar texto plano desde un array de objetos
  generateTxtFromProducts(productos: any[]): string {
    return productos
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
  }
}
