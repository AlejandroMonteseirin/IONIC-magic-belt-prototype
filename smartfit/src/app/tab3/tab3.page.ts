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
  image:any=null;
  opencvimage:any=null;
  constructor(private file:File, private camera: Camera,private platform:Platform) {
    console.log("inicializando OpenCV... ")
    if(cv!=undefined){
      console.log("Inicialización Correcta!")
    }else{
      console.log("Inicialización fallida :(");
    }
  }
  

  
  
  takePhoto() {

    this.platform.ready().then(() => {
        if(this.platform.is('cordova')){
            this.camera.getPicture(this.options).then((imageData) => {
              //procesa la imagen
                let filename = imageData.substring(imageData.lastIndexOf('/')+1);
                let path =  imageData.substring(0,imageData.lastIndexOf('/')+1);
                this.file.readAsDataURL(path, filename).then((res)=>{
                  this.image = res ;
                  })
                  
                })
              
              .catch(err => console.warn(err));
                
              
            
            
        }
    })
  }

  procesar(){
    this.opencvimage = cv.imread('img');
    let cinturon = cv.imread('cinturon');
    console.log(this.opencvimage.cols);
    let proporcion=cinturon.size().height/this.opencvimage.size().height;
    console.log(proporcion);

    let dsize = new cv.Size(this.opencvimage.size().width*proporcion, cinturon.size().height);
    cv.resize( this.opencvimage,  this.opencvimage, dsize, 0, 0, cv.INTER_AREA);
    console.log(dsize);

    //this.opencvimage=resized;
    console.log("Cargadas imagenes!")
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.matchTemplate(cinturon, this.opencvimage, dst, cv.TM_CCOEFF, mask);
    let result = cv.minMaxLoc(dst, mask);
    console.log(result);
    let maxPoint = result.maxLoc;
    let color = new cv.Scalar(255, 0, 0, 255);
    let point = new cv.Point(maxPoint.x + this.opencvimage.size().width, maxPoint.y + this.opencvimage.size().height);
    cv.rectangle(cinturon, maxPoint, point, color, 2, cv.LINE_8, 0);
    cv.imshow('canvasOutput', cinturon);
    console.log(this.opencvimage.size());
    console.log(cinturon.size());
    console.log(maxPoint.x +'+'+ this.opencvimage.cols, maxPoint.y +'+'+ this.opencvimage.rows);
    console.log(maxPoint.x +'+'+ this.opencvimage.cols, maxPoint.y +'+'+ this.opencvimage.rows);



    //cv.imshow('canvasOutput2', dst);

    //let blancoynegro=new cv.Mat();
    //cv.cvtColor(this.opencvimage, blancoynegro, cv.COLOR_RGBA2GRAY, 0);
    //cv.imshow('canvasOutput', blancoynegro);

  }

}
