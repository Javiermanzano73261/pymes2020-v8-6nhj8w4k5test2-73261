import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Servicio } from "../models/servicio";

@Injectable({
  providedIn: "root"
})
export class ServiciosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    // la barra al final del resourse url es importante para los metodos que concatenan el id del recurso (GetById, Put)
    //this.resourceUrl = "https://pavii.ddns.net/api/articulos/";
    this.resourceUrl = "https://bitgocba.duckdns.org/api/servicios";
  }

  get(Descripcion: string, Importe: boolean, CantidadHoras: number) {
    let params = new HttpParams();
    if (Descripcion != null) {
      params = params.append("Descripcion", Descripcion);
    }
         // para evitar error de null.ToString()
      params = params.append("Importe", Importe.toString());
      
    if (Importe != null)  {                                                      
    params = params.append("CantidadHoras", CantidadHoras.toString());}    
    return this.httpClient.get(this.resourceUrl, { params: params });
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  post(obj:Servicio) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj:Servicio) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
}
