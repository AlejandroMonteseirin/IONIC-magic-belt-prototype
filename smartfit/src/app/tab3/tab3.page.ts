import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular'; //import Platform
declare var cv: any;
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  image:any;
  constructor(private camera: Camera,private platform:Platform) {
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
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                let base64Image = 'data:image/jpeg;base64,' + imageData;
                this.image=base64Image;
                console.log("fotaso");
                let src = cv.imread('img');

            }, (err) => {
                // Handle error
            });
        }
    })
  }

}
