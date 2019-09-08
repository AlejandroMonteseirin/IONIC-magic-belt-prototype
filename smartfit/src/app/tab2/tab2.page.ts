import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  medida:any=[];
  resultados:any=[];
  tipoPrenda:any="Camiseta";
  baseDeDatos:any=[];
  holgura=[];
  error:any=false;
  noresult:any=false;
  constructor(private storage:Storage) {
  }
  
  inicializarBd(){
    this.baseDeDatos=[];
    console.log(this.tipoPrenda);
    let bd=[
      "assets/bd/Camiseta1Talla38(81_64_93)",
      "assets/bd/Camiseta1Talla40(85_68_97)",
      "assets/bd/Camiseta1Talla42(89_72_101)",
      "assets/bd/Camiseta2Talla38(82_65_94)",
      "assets/bd/Camiseta2Talla40(86_69_98)",
      "assets/bd/Camiseta2Talla42(90_73_102)",
      "assets/bd/Camiseta3Talla38(83_66_95)",
      "assets/bd/Camiseta3Talla40(87_70_99)",
      "assets/bd/Camiseta3Talla42(91_74_103)",
      "assets/bd/Camiseta4Talla38(84_67_96)",
      "assets/bd/Camiseta4Talla40(88_71_100)",
      "assets/bd/Camiseta4Talla42(92_75_104)",
      "assets/bd/Vestido1Talla38(81_64_93)",
      "assets/bd/Vestido1Talla40(85_68_97)",
      "assets/bd/Vestido1Talla42(89_72_101)",
      "assets/bd/Vestido2Talla38(82_65_94)",
      "assets/bd/Vestido2Talla40(86_69_98)",
      "assets/bd/Vestido2Talla42(90_73_102)",
      "assets/bd/Vestido3Talla38(83_66_95)",
      "assets/bd/Vestido3Talla40(87_70_99)",
      "assets/bd/Vestido3Talla42(91_74_103)",
      "assets/bd/Vestido4Talla38(84_67_96)",
      "assets/bd/Vestido4Talla40(88_71_100)",
      "assets/bd/Vestido4Talla42(92_75_104)",
    ];
    let temp;
    let temp2;
    for(let prenda of bd){
      if(!prenda.includes(this.tipoPrenda)){
        continue;
      }
      temp2=prenda.split("/");
      temp2=temp2[2].split("T");
      temp2=temp2[0][temp2[0].length -1];

      temp=prenda.replace(")", "");
      temp=temp.split("(");
      temp=temp[1].split("_");
      this.baseDeDatos.push({"url":prenda+".jpg","medidas":[ parseFloat(temp[0]), parseFloat(temp[1]), parseFloat(temp[2])],"holguraTotal":this.calculadorHolgura([ parseFloat(temp[0]), parseFloat(temp[1]), parseFloat(temp[2])]),"talla":temp2});

    }
  
  }

  buscar(){
    this.resultados=[];
    this.storage.get("medidas").then((res)=>{
      this.storage.get("holgura").then((res2)=>{

        console.log(res);
        console.log(res2);
        this.holgura=res2;


        if(res==null || res.length<2 ){
          this.error=true;

          setTimeout(() => {
            this.error=false;

          },1000);
          return false;
        }

        this.medida[0]=parseFloat(res[0]);
        this.medida[1]=parseFloat(res[1]);
        this.medida[2]=parseFloat(res[2]);

        this.inicializarBd();
        console.log(this.medida);
        console.log(this.baseDeDatos);

        this.baseDeDatos.sort(this.compare);
        console.log(this.baseDeDatos);
        let numerodeprendasamostrar=3;
        for(let prenda of this.baseDeDatos){
          if(prenda.holguraTotal<999 && numerodeprendasamostrar!=0){
            this.resultados.push(prenda);
            numerodeprendasamostrar=numerodeprendasamostrar-1;
          }else{
            break;
          }
        }
        console.log(this.resultados);
        if(this.resultados.length==0){
          this.noresult=true;

          setTimeout(() => {
            this.noresult=false;

          },1000);
          return false;
        }
      });
    });
  }

  calculadorHolgura(medidas){
    let indices = [0, 1, 2];
    let holgura=0;
    for (let i of indices) {
      if(medidas[i]<this.medida[i]+this.holgura[i]){
        return 999;
      }
    }
    for (let i of indices) {
      holgura=holgura+medidas[i]-this.medida[i]-this.holgura[i];
    }
    return holgura;
  }

  compare( a, b ) {
    if ( a.holguraTotal < b.holguraTotal ){
      return -1;
    }
    if ( a.holguraTotal > b.holguraTotal ){
      return 1;
    }
    return 0;
  }
  
  calculador(number){
    let color="verde";
    let valor=100;
    if(number<2)
      color="verde";
      valor=100-(number*5)/2;
    if(number>=2 && number<4)
      color="naranja";
      valor=100-(number*5)/2;
    if(number>=4){
      color="rojo";
      valor=(4*90)/number
    }
    if(valor.toString().length>5){
      let valor2=valor.toString().slice(0, 5);
      return [color,valor2];

    }
    return [color,valor];
  }
}
//    this.resultados=[{'nombre':'Pantalon1','medida':this.medida, "marca":"Inditex","url":"https://media.wuerth.com/stmedia/modyf/shop/900px/2125180.jpg","descripcion":"pantalon muy cómodo 100% algodon..."},{'nombre':'Pantalon1','medida':this.medida, "marca":"Inditex","url":"https://media.wuerth.com/stmedia/modyf/shop/900px/2125180.jpg","descripcion":"pantalon muy cómodo 100% algodon..."}];