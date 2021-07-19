import { Component } from '@angular/core';
import exifr from 'exifr';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { CameraService } from '../camera.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  exifText: string;
  imgsrc: string;

  constructor(private cameraService: CameraService) {
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
    this.exifText = `${this.toString(coordinates)} ${this.toString(image.exif)}`;

    const src: string = await this.cameraService.process(image, coordinates);
    this.imgsrc = src;

    const response: Response = await fetch(src);
    const exif = await exifr.parse(await response.arrayBuffer());
    console.log('exif in file', this.toString(exif));
    this.exifText = this.toString(exif);
  }

  async selectPicture() {
    console.log('select');
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    });

    const response: Response = await fetch(image.webPath);
    const exif = await exifr.parse(await response.arrayBuffer());
    console.log('exif in file', this.toString(exif));
    this.exifText = this.toString(exif);
  }

  toString(o: any): string {
    if (o === undefined) {return undefined;}
    return JSON.stringify(o, Object.keys(o).sort(), 4);
  }

}
