import { Component } from '@angular/core';
import exifr from 'exifr';

import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

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


  async takePicture() {
    console.log('take');
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    fetch(image.webPath).then((resp) => resp.arrayBuffer()).then(async (ab) => {
      console.log(ab);

      const exif = await exifr.parse(ab, options);
      console.log(exif);
    });
  }

}
