import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../Category';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  title = 'Add/Update Product';
  productForm: FormGroup;
  imageFile: File | undefined;
  action: string;
  categories: Category[] | undefined;
  selectedFileName: string | undefined;
  constructor(
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder
  ) {
    console.log('data:', data);
    this.categories = data.categories;
    if (data.action === 'Edit') {
      this.productForm = this.fb.group({
        name: [data.product.name || '', Validators.required],
        description: [data.product.description || '', Validators.required],
        price: [data.product.price || '', Validators.required],
        availableStock: [data.product.availableStock || '', Validators.required],  
        categoryId: ['', Validators.required],      
        image: [null]
      });
      this.productForm.patchValue({
        categoryId: this.data.product.categoryId
      });

    } else {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        availableStock: ['', Validators.required],
        categoryId: ['', Validators.required],
        image: [null, Validators.required]
      });
    }
    this.action = data.action;
  }

  onFileChange(event: any): void {    
    const file = event.target.files[0];
    this.productForm?.patchValue({ image: file }); // Patch form with selected file
    this.productForm.get('image')?.markAsDirty();     
    this.imageFile = file;
    this.selectedFileName = file.name;
  }


  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close({ action: this.action, product: { id: this.data?.product?.id, ...this.productForm.value } });
    }
  }

}


