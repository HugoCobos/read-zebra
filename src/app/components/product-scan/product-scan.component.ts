import { Component, effect, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SqliteService } from '../../database/sqlite.service';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'product-scan',
  imports: [ReactiveFormsModule],
  templateUrl: './product-scan.component.html',
})
export class ProductScanComponent {
  producto = input<any | null | undefined>(undefined); // undefined = sin búsqueda, null = no encontrado

  fb = inject(FormBuilder);

  productService = inject(SqliteService);

  myForm!: FormGroup;

  constructor() {
    this.myForm = this.fb.group({
      stock: [0, [Validators.required, Validators.min(0)]],
    });

    // efecto reactivo: escucha cambios en `producto`
    effect(() => {
      if (this.producto()) {
        this.myForm.patchValue({
          stock: this.producto().cantidad_stock,
        });
      }
    });
  }

  async onSave() {
    if (this.myForm.valid && this.producto) {
      const nuevoStock = this.myForm.get('stock')?.value;

      try {
        await this.productService.updateStock(
          this.producto().codigo_producto,
          nuevoStock
        );
        await Toast.show({
          text: 'Stock actualizado correctamente.',
        });
      } catch (error) {
        await Toast.show({
          text: 'Error al actualizar stock.',
        });
      }
    }
  }
}
