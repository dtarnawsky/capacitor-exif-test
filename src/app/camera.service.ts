import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Position } from '@capacitor/geolocation';
import piexifjs from 'piexifjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }


  /**
   * This method takes a camera image and a GPS location and returns an image that contains the GPS location in the EXIF
   *
   * @param image Original Camera Image
   * @param position GPS position information taken from the Capacitor Geolocation plugin
   * @returns Promise Returns a base64 string you can use in an image tag
   */
  public async process(image: Photo, position: Position): Promise<string> {
    const t = this;
    const res: Response = await fetch(image.webPath);
    const blob: Blob = await res.blob();
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          const curexif = piexifjs.load(this.result);
          const exif = curexif.Exif;
          const zeroth = curexif['0th'];
          const gps = curexif.GPS;
          if (position && position.coords) {
            const date = new Date(position.timestamp);
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const day = date.getDate();
            const gpsDate = `${t.pad(year)}:${t.pad(month)}:${t.pad(day)} ${t.pad(hour)}:${t.pad(minute)}:${t.pad(second)}`;
            gps[piexifjs.GPSIFD.GPSDateStamp] = gpsDate; // In the format "1999:99:99 99:99:99";
            gps[piexifjs.GPSIFD.GPSLatitudeRef] = position.coords.latitude < 0 ? 'S' : 'N';
            gps[piexifjs.GPSIFD.GPSLatitude] = piexifjs.GPSHelper.degToDmsRational(position.coords.latitude);
            gps[piexifjs.GPSIFD.GPSLongitudeRef] = position.coords.longitude < 0 ? 'W' : 'E';
            gps[piexifjs.GPSIFD.GPSLongitude] = piexifjs.GPSHelper.degToDmsRational(position.coords.longitude);
          }
          // Construct the new exifObject
          const exifStr = piexifjs.dump({ '0th': zeroth, Exif: exif, GPS: gps });
          const inserted = piexifjs.insert(exifStr, this.result);
          resolve(inserted);
        }
        catch (err) {
          reject(err);
        }
      };

      reader.readAsDataURL(blob);
    });
  }

  private pad(s: number): string {
    return ('0' + s).slice(-2);
  }



}
