import { Component, OnInit } from '@angular/core';
import { Servicio } from "../../models/servicio";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDialogService } from "../../services/modal-dialog.service";
import { ServiciosService } from "../../services/servicios.service";

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

  Titulo = "Servicios"; 
  TituloAccionABMC = {
    A: "(Agregar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de servicios (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Lista: Servicio[] = [];
  RegistrosTotal: number;


  FormFiltro: FormGroup;
  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private servicioService: ServiciosService,
    private modalDialogService: ModalDialogService
  ) {}
  

  ngOnInit() {
    this.FormFiltro = this.formBuilder.group({
    });
    this.FormReg = this.formBuilder.group({
      IdServicio: [0],
      Descripcion: [
        "",
        [Validators.required, Validators.minLength(10), Validators.maxLength(30)]
      ],
      Importe: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      CantidadHoras: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      
    });
     // this.GetServicios();
  }

    GetServicios() {
    this.servicioService.get()
    .subscribe((res:Servicio[]) => {
      this.Lista = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset();
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }

   // Buscar segun los filtros, establecidos en FormReg
  Buscar() {
    this.servicioService
      .get()
      .subscribe((res: any) => {
        this.Lista = res.Lista;
        this.RegistrosTotal = res.RegistrosTotal;
      });
  }


  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
     if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    // agregar post
    if (itemCopy.IdServicio == 0 || itemCopy.IdServicio == null) {
      itemCopy.IdServicio = 0;
      this.servicioService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.servicioService
        .put(itemCopy.IdServicio, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        });
    }
  }


  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  

 

}