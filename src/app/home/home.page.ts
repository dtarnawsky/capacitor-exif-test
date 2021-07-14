import { Component } from '@angular/core';
import exifr from 'exifr';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

const options = {
  ifd1: false,
  exif: true,
  interop: false,
  gps: true,
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  exifText: string;

  constructor() {
  }

  async takePicture() {
    console.log('take');
    const coordinates = await Geolocation.getCurrentPosition();
    
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    });
    
    console.log('Location', coordinates);

    console.log('exif in image', this.toString(image.exif));
    this.exifText = this.toString(coordinates) + " " + this.toString(image.exif);

    fetch(image.webPath).then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log('exif in file', this.toString(exif)); 
    });
  }

  async selectPicture() {
    console.log('select');
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    });

    console.log('exif in image', this.toString(image.exif));   
    
    fetch(image.webPath).then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log('exif in file', this.toString(exif)); 
      this.exifText = this.toString(exif);
    });
  }

  toString(o: Object): string {
    return JSON.stringify(o, Object.keys(o).sort(), 4);
  }

}
