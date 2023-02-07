import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent {
  productosform: FormGroup;
  titulo = 'Crear producto';
  id: String | null;

  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _productoService: ProductoService,
              private aRouter: ActivatedRoute) {
    this.productosform = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required]
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.esEditar();
  }
  agregarProducto(){
    console.log(this.productosform)
    console.log(this.productosform.get('producto')?.value)

    const PRODUCTO: Producto = {
      nombre: this.productosform.get('producto')?.value,
      categoria: this.productosform.get('categoria')?.value,
      ubicacion: this.productosform.get('ubicacion')?.value,
      precio: this.productosform.get('precio')?.value
    }

    if(this.id !== null){
      //editamos producto
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data =>{
        this.toastr.info('El producto fue actualizado con exito!', 'Producto Actualizado!');
        this.router.navigate(['/']);
      }, error =>{
        console.log(error);
        this.productosform.reset();
      })
    }else{
      //Agregamos producto
      console.log(PRODUCTO);
      this._productoService.guardarProducto(PRODUCTO).subscribe(data =>{
        this.toastr.success('El producto fue registrado con exito!', 'Producto Registrado!');
        this.router.navigate(['/']);
      }, error =>{
        console.log(error);
        this.productosform.reset();
      })
    }
  }

  esEditar(){
    if(this.id !== null){
      this.titulo ='Editar Producto';
      this._productoService.obtenerProducto(this.id).subscribe(data =>{
        this.productosform.setValue({
          producto: data.nombre,
          categoria: data.categoria,
          ubicacion: data.ubicacion,
          precio: data.precio
        })
      })
    }
  }
}
