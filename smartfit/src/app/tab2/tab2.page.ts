import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  medida:any=0;
  resultados:any=[];
  constructor() {}

  buscar(){
    console.log("medida");
    console.log(this.medida);

    //this.resultados.push({'nombre':'Pantalon de '+this.medida+"cm",'medida':this.medida, "marca":"Inditex","url":"https://media.wuerth.com/stmedia/modyf/shop/900px/2125180.jpg","descripcion":"pantalon muy cómodo 100% algodon..."});
    this.resultados=[{'nombre':'Pantalon1','medida':this.medida, "marca":"Inditex","url":"https://media.wuerth.com/stmedia/modyf/shop/900px/2125180.jpg","descripcion":"pantalon muy cómodo 100% algodon..."},{'nombre':'Pantalon1','medida':this.medida, "marca":"Inditex","url":"https://media.wuerth.com/stmedia/modyf/shop/900px/2125180.jpg","descripcion":"pantalon muy cómodo 100% algodon..."}];

  }
}
