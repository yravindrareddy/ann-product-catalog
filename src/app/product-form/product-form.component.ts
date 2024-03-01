import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  title = 'Add/Update Product';
  productForm: FormGroup;
  action: string;
  constructor(
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder
  ) {
    console.log('data:', data);
    if (data.action === 'Edit') {
      this.productForm = this.fb.group({
        name: [data.product.name || '', Validators.required],
        description: [data.product.description || '', Validators.required],
        price: [data.product.price || '', Validators.required],
        availableStock: [data.product.availableStock || '', Validators.required]
      });
    } else {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        availableStock: ['', Validators.required]
      });
    }
    this.action = data.action;
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close({ action: this.action, product: { id: this.data?.product?.id, ...this.productForm.value, categoryId: 2 } });
    }
  }

}


