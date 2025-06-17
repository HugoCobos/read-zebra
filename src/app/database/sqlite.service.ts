import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initialized = false;

  private nombreArchivoEntrada = signal<string>('');

  // Inicializar la base de datos y crear la tabla
  async init(): Promise<void> {
    if (this.initialized) return;

    await this.ensureConnection();
    await this.db.open();

    // Configuración SQLite optimizada para tu caso de uso
    await this.db.query('PRAGMA journal_mode = WAL;');
    await this.db.query('PRAGMA synchronous = NORMAL;');
    await this.db.query('PRAGMA cache_size = -8000;');
    await this.db.query('PRAGMA temp_store = MEMORY;');
    await this.db.query('PRAGMA mmap_size = 67108864;');


    // Crear la tabla 'productos' si no existe
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        codigo_producto TEXT PRIMARY KEY NOT NULL,
        referencia TEXT,
        descripcion TEXT,
        unidad_medida TEXT,
        cantidad_stock INTEGER,
        valor_adicional INTEGER
      );
    `);

    await this.db.execute(`CREATE INDEX IF NOT EXISTS idx_codigo_producto ON productos(codigo_producto);`);

    this.initialized = true;
  }

  // Guardar los datos en la base de datos
  async saveData(data: any[]): Promise<void> {
    await this.init();

    // Definir la sentencia SQL para insertar los datos en la tabla 'productos'
    const stmt = `
    INSERT INTO productos (
      codigo_producto,
      referencia,
      descripcion,
      unidad_medida,
      cantidad_stock,
      valor_adicional
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

    for (const row of data) {
      await this.db.run(stmt, [
        (row.codigo_producto ?? '').trim(),
        (row.referencia ?? '').trim(),
        (row.descripcion ?? '').trim(),
        (row.unidad_medida ?? '').trim(),
        Number(row.cantidad_stock ?? 0),
        Number(row.valor_adicional ?? 0),
      ]);
    }
  }

  private async ensureConnection(): Promise<void> {
    const dbName = 'localdb';
    const isConnection = await this.sqlite.isConnection(dbName, false);
    this.db = isConnection.result ? await this.sqlite.retrieveConnection(dbName, false) : await this.sqlite.createConnection(dbName, false, 'no-encryption', 1, false);
  }

  // obtener todos los datos
  async getAllData(): Promise<any[]> {
    await this.init();
    const result = await this.db.query('SELECT * FROM productos');
    return result.values ?? [];
  }

  // Buscar producto por codigo_producto (sin modificar stock)
  async getByCodigoProducto(codigo: string): Promise<any[]> {
    await this.init();
    return this.buscarProducto(codigo);
  }

  // Buscar producto y actualizar stock en +1
  async getProductAndUpdateStock(codigo: string): Promise<any[]> {
    await this.init();

    const producto = (await this.buscarProducto(codigo))[0];

    if (producto) {
      const nuevoStock = producto.cantidad_stock + 1;

      await this.db.run(
//        'UPDATE productos SET cantidad_stock = ? WHERE TRIM(LOWER(codigo_producto)) = ?',
        'UPDATE productos SET cantidad_stock = ? WHERE codigo_producto = ?', [nuevoStock, codigo.trim().toLowerCase()]
      );
      return this.buscarProducto(codigo); // Retornar actualizado
    }

    return [];
  }

  // Actualizar stock con una cantidad específica
  async updateStock(codigo: string, nuevaCantidad: number): Promise<any[]> {
    await this.init();

    const producto = (await this.buscarProducto(codigo))[0];

    if (producto) {
      const trimmedCode = codigo.trim().toLowerCase();
      await this.db.run(
        'UPDATE productos SET cantidad_stock = ? WHERE codigo_producto = ?', [nuevaCantidad, trimmedCode]
      );

      // Retornar el producto actualizado
      return this.buscarProducto(codigo);
    }

    return [];
  }

  // Método privado reutilizable para buscar producto
  private async buscarProducto(codigo: string): Promise<any[]> {
    const trimmedCode = codigo.trim().toLowerCase();

    const result = await this.db.query(
      'SELECT * FROM productos WHERE codigo_producto = ?', [trimmedCode]
    );

    return result.values ?? [];
  }

  // Obtener la unidad_medida con mayor cantidad_stock
  async getUnidadMedidaConMasStock(): Promise<string | null> {
    await this.init();

    const result = await this.db.query(`
    SELECT unidad_medida
    FROM productos
    ORDER BY cantidad_stock DESC
    LIMIT 1
    `);

    return result.values?.[0]?.unidad_medida ?? null;
  }

  // Eliminar todos los datos de la tabla 'productos'
  async deleteData(): Promise<void> {
    await this.init();
    await this.db.execute('DELETE FROM productos');
  }

  // ==== METODOS PARA GUARDAR Y EXTRAER EL NOMBRE DEL ARCHIVO ====

  async setNombreArchivoEntrada(nombre: string): Promise<void> {
    this.nombreArchivoEntrada.set(nombre.trim());
    await Preferences.set({ key: 'nombreArchivoEntrada', value: this.nombreArchivoEntrada() });
  }

  async cargarNombreArchivoEntrada(): Promise<void> {
    const result = await Preferences.get({ key: 'nombreArchivoEntrada' });
    this.nombreArchivoEntrada.set(result.value ?? '');
  }

  async getNombreArchivoSalida(): Promise<string | null> {
    const unidadMedida = await this.getUnidadMedidaConMasStock();
    await this.cargarNombreArchivoEntrada();

    console.log("----------- unidadMedida", unidadMedida);
    console.log("----------- nombreArchivoEntrada", this.nombreArchivoEntrada());

    if (!this.nombreArchivoEntrada() || !unidadMedida) return null;

    const nombreSinExtension = this.nombreArchivoEntrada().replace(/\.[^/.]+$/, ''); // Eliminar la extensión del nombre original);

    // Extraer últimos 2 dígitos numéricos del nombre original
    const match = nombreSinExtension.match(/(\d{2})$/);
    const sufijo = match ? match[1] : '00';

    // Crear nombre final: base + unidad + sufijo + .TXT
    //const baseNombre = nombreSinExtension.replace(/(\d{4})$/, ''); asi estaba antes de la modificación del nombre del archivo de salida
    const baseNombre = nombreSinExtension;;

    // blanqueamos el nombre almacenado
    //await Preferences.remove({ key: 'nombreArchivoEntrada' });
    return `${baseNombre}.TXT`;
  }

  async hayDatos(): Promise<boolean> {
    try {
      await this.init();
      const result = await this.db.query('SELECT EXISTS(SELECT 1 FROM productos LIMIT 1) AS existe');
      return result.values?.[0].existe === 1;
    } catch (err) {
      console.error('Error al consultar la tabla:', err);
      return false;
    }
  }
}
