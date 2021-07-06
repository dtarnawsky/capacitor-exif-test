import { Component } from '@angular/core';
import exifr from 'exifr';
import { Camera, CameraResultType } from '@capacitor/camera';


const options = {
  ifd1: false,
  exif: true,
  interop: false,
  gps: false,
};
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {


    fetch('/assets/test-image.jpg').then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log(exif);
    });

  }

  toString(o: Object): string {
    return JSON.stringify(o, Object.keys(o).sort(), 4);
  }

  async takePicture() {
    console.log('take');
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    console.log('exif in image', this.toString(image.exif));
    

    fetch(image.webPath).then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log('exif in file', this.toString(exif));      
    });
  }

}
