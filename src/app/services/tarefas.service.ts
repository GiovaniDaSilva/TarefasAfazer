import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  constructor(private http : HttpClient) { }


  adicionar(pTarefa : string){
    let url = 'http://localhost:17901/api/todo';
    let header = {
      headers: new HttpHeaders()
      .set('Content-Tpe', 'application/json')
    }

    let param = {Nome: pTarefa}
    return this.http.post(url,param, header).toPromise();
  };


  atualizar(pTarefa : any){
    
    let url = 'http://localhost:17901/api/todo';
    let header = {
      headers: new HttpHeaders()
      .set('Content-Tpe', 'application/json')
    }

    return this.http.put(url,pTarefa, header).toPromise();
  }

  list(){
    let url = 'http://localhost:17901/api/todo';
      
    return this.http.get(url).toPromise();
  };

  delete(id : any){
    let url = 'http://localhost:17901/api/todo/' + id;
    return this.http.delete(url).toPromise();
  }

}
