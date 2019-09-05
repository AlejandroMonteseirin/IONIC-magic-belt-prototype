import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular'; //import Platform
import { File } from '@ionic-native/file/ngx';
import { VirtualTimeScheduler } from 'rxjs';

declare var cv: any;
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  options: CameraOptions = {
    quality: 100,
    allowEdit: true,
    
    //saveToPhotoAlbum: true,
    correctOrientation: true,
    encodingType: this.camera.EncodingType.JPEG,
    destinationType: this.camera.DestinationType.FILE_URI
  }
  holgura:any=[0,0,0];
  cinturon:any=null;
  image:any=[];
  opencvimage:any=null;
  medida:any=[];
  autocut=false;
  partedelcuerpoquetoca:any;
  partesdelcuerpo=['PECHO','CINTURA','CADERA'];
  constructor(private file:File, private camera: Camera,private platform:Platform) {
    console.log("inicializando OpenCV... ")
    if(cv!=undefined){
      console.log("Inicialización Correcta!");

    }else{
      console.log("Inicialización fallida :(");
    }
    this.partedelcuerpoquetoca=0;
  }
  

  
  
  takePhoto(partecuerpo) {
    /** temp autoreset */
    this.cinturon=null;
    /*
    cv.imshow('canvasOutput',cv.Mat.zeros(1, 1, 0));
    cv.imshow('thresholdbyn', cv.Mat.zeros(1, 1, 0));
    cv.imshow('threshold', cv.Mat.zeros(1, 1, 0));
    cv.imshow('contornos', cv.Mat.zeros(1, 1, 0));
    cv.imshow('recorte', cv.Mat.zeros(1, 1, 0));
    cv.imshow('pintado', cv.Mat.zeros(1, 1, 0));

     */
    if(this.autocut){
      this.options = {
        quality: 100,
        allowEdit: false,
        correctOrientation: false,
        encodingType: this.camera.EncodingType.JPEG,
        destinationType: this.camera.DestinationType.FILE_URI
      }
    }else{
      this.options = {
        quality: 100,
        allowEdit: true,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
        destinationType: this.camera.DestinationType.FILE_URI
      }
    }
    if(this.cinturon==null){
      this.cinturon= cv.imread('cinturon'); 

    }
    this.platform.ready().then(() => {
        if(this.platform.is('cordova')){
            this.camera.getPicture(this.options).then((imageData) => {
              
              //procesa la imagen
                let filename = imageData.substring(imageData.lastIndexOf('/')+1);
                let path =  imageData.substring(0,imageData.lastIndexOf('/')+1);
                this.file.readAsDataURL(path, filename).then((res)=>{
                  this.image[partecuerpo] = res ;
                  setTimeout(() => 
                    { 
                      if(this.autocut){
                        let recorte =this.recortador(partecuerpo);
                        this.procesar(partecuerpo,recorte);
                        this.partedelcuerpoquetoca=partecuerpo+1;
                      }else{
                        this.procesar(partecuerpo,null);
                        this.partedelcuerpoquetoca=partecuerpo+1;
                      }
                    },
                    500);
                
                  })
                  
                })
              
              .catch(err => console.warn(err));
                
              
            
            
        }
    })
  }
  procesar(index,recorte){
    if(recorte==null){
      this.opencvimage = cv.imread('img'+index);
    }
    else{
      this.opencvimage = recorte;

    }
    let proporcion=this.cinturon.size().height/this.opencvimage.size().height;
    let dsize = new cv.Size(this.opencvimage.size().width*proporcion, this.cinturon.size().height);
    cv.resize( this.opencvimage,  this.opencvimage, dsize, 0, 0, cv.INTER_AREA);
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(this.cinturon, this.opencvimage, dst, cv.TM_CCOEFF, mask);
    let result = cv.minMaxLoc(dst, mask);
    console.log(result);
    let maxPoint = result.maxLoc;
    let color = new cv.Scalar(255, 0, 0, 255);
    let point = new cv.Point(maxPoint.x + this.opencvimage.size().width, maxPoint.y + this.opencvimage.size().height);
    cv.rectangle(this.cinturon, maxPoint, point, color, 2, cv.LINE_8, 0);
   /* cv.imshow('canvasOutput', this.cinturon);*/
    this.medida[index]=(maxPoint.x+ this.opencvimage.cols)*0.0211663216
  }
  /*
  procesarTodo(){
  let index=0;
  for(let imagen in this.partesdelcuerpo){
    
    this.opencvimage = cv.imread('img'+index);
    console.log(this.cinturon.cols);
    console.log(this.cinturon.size().width);

    let proporcion=this.cinturon.size().height/this.opencvimage.size().height;

    let dsize = new cv.Size(this.opencvimage.size().width*proporcion, this.cinturon.size().height);
    cv.resize( this.opencvimage,  this.opencvimage, dsize, 0, 0, cv.INTER_AREA);

    //this.opencvimage=resized;
    console.log("Cargadas imagenes!")
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(this.cinturon, this.opencvimage, dst, cv.TM_CCOEFF, mask);
    let result = cv.minMaxLoc(dst, mask);
    console.log(result);
    let maxPoint = result.maxLoc;
    let color = new cv.Scalar(255, 0, 0, 255);
    let point = new cv.Point(maxPoint.x + this.opencvimage.size().width, maxPoint.y + this.opencvimage.size().height);
    cv.rectangle(this.cinturon, maxPoint, point, color, 2, cv.LINE_8, 0);
    cv.imshow('canvasOutput', this.cinturon);
    console.log(this.opencvimage.size());
    console.log(this.cinturon.size());
    console.log(maxPoint.x +'+'+ this.opencvimage.cols, maxPoint.y +'+'+ this.opencvimage.rows);
    console.log("medida"+maxPoint.x*0.0211663216);
    this.medida[index]=(maxPoint.x+ this.opencvimage.cols)*0.0211663216

    index++;
    }
  }
  */
  rotatePoint(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  
  };
  
  recortador(index){
    let src = cv.imread('img'+index);
    let dst = new cv.Mat();

    cv.cvtColor(src,dst, cv.COLOR_RGB2GRAY);
    /*cv.imshow('thresholdbyn', dst);*/
    cv.threshold(dst, dst, 120, 255, cv.THRESH_TOZERO);
  /*  cv.imshow('threshold', dst);*/
    

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let contornos = dst;

    for (let i = 0; i < contours.size(); ++i) {
      let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                Math.round(Math.random() * 255));
      cv.drawContours(contornos, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    }
  /*  cv.imshow('contornos', contornos);*/


    let areaMax=0;
    let indexMax=0;
    let area=-1;
    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      area = cv.contourArea(cnt)
      if(area>areaMax){
      areaMax=area;
      indexMax=i;
      }
    }
    
    
    let arriba1;
    let arriba2;
    let arriba1valor=9999999;
    let arriba2valor=9999999;
      let cntFinal = contours.get(indexMax);
    let rotatedRect = cv.minAreaRect(cntFinal );
    let vertices = cv.RotatedRect.points(rotatedRect);
    //COJO LOS DOS MAS DE ARRIBA  Y EL PRIMERO ES EL DE MAS A LA IQUIERDA
    for (let i = 0; i < vertices.length; i++) { 

    if(vertices[i].y<=arriba1valor){
      if(arriba1 !=undefined){
      arriba2=arriba1;
      arriba2valor=arriba1.y
      }
      arriba1valor=vertices[i].y;
      arriba1=vertices[i];

    }
    if(vertices[i].y>arriba1valor && vertices[i].y<=arriba2valor){
      arriba2=vertices[i];
      arriba2valor=vertices[i].y;
    }
    }
    if (arriba2.x<arriba1.x){
    let temp=arriba1;
    arriba1=arriba2;
    arriba2=temp;
    }
    console.log(arriba1,arriba2);
    let angleDeg = Math.atan2(arriba2.y - arriba1.y, arriba2.x - arriba1.x) * 180 / Math.PI;

    console.log(angleDeg);
    let center = new cv.Point(src.cols / 2, src.rows / 2);
    let dsize = new cv.Size(src.cols, src.rows);
    let M = cv.getRotationMatrix2D(center, angleDeg, 1);
    cv.warpAffine(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    let maxX=0;
    let maxY=0;
    let minX=9999999;
    let minY=9999999;
    let pointRotado;

    for (let i = 0; i < vertices.length; i++) { 

    pointRotado=this.rotatePoint(center.x,center.y, vertices[i].x,vertices[i].y, angleDeg );

    if(pointRotado[0]>maxX)
      maxX=pointRotado[0];
    if(pointRotado[1]>maxY)
      maxY=pointRotado[1];
    if(pointRotado[0]<minX)
      minX=pointRotado[0];
    if(pointRotado[1]<minY)
      minY=pointRotado[1];
    }
    //EL ORIGEN DEL EJE ES ARRIBA A LA IZQUIERDA xd
    let rectFinal = new cv.Rect(minX,minY,(maxX-minX), (maxY-minY));

    let final=src.roi(rectFinal);
    // pintar 
    let rectangleColor = new cv.Scalar(255, 0, 0);

    let point1 = new cv.Point(maxX, minY);
    let point2 = new cv.Point(minX, maxY);
    let pintado = final;
    cv.rectangle(pintado, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);/*
    cv.imshow('pintado', final);

    cv.imshow('recorte', final);
*/
    return final;
  }
}
