import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-img-picker',
  templateUrl: './img-picker.component.html',
  styleUrls: ['./img-picker.component.scss'],
})
export class ImgPickerComponent implements OnInit {
  // access to the file picker from the img-picker input
  @ViewChild('filePicker', { static: false }) filePicker: ElementRef<HTMLInputElement>;
  // emiting the image is capture by the camera being a string or a file
  @Output() imagePick = new EventEmitter<string | File>();

  selectedImage: string;
  usePicker = false;

  constructor(
              private actionSheetCtrl: ActionSheetController
              ) {}

  ngOnInit() {
    this.usePicker = true;
  }

  // actonsheet to display once the camare button is clicked
  onPickImage() {
    this.actionSheetCtrl
    .create({
      header: 'Please Choose',
      buttons: [
        {
          text: 'Take a Picture',
          handler: () => {
            this.onOpenCamera();
          }
        },
        {
          text: 'Pick from your Phone',
          handler: () => {
            this.onPickFromFile();
          }
        },
        { text: 'Cancel', role: 'cancel' }
      ]
    })
    .then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

   // accessing the camera
  onOpenCamera() {
    // if capacitor do not find a camara just return
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    // general settings for the camera
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.DataUrl
    })
    .then(image => {
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
    })
    .catch(err => {
      console.log(err);
      return false;
    });

    }
    // openning the system file to upload a picture
    onPickFromFile() {
      if (this.usePicker) {
        this.filePicker.nativeElement.click();
      } else {
        return;
      }
    }

    // able to choose the file from the device extracting the file from the event.target
    onFileChosen(event: Event) {
      const chosenFile = (event.target as HTMLInputElement).files[0];
      if (!chosenFile) {
        return;
      }
      // if there is an image I execute the file reading the data by emiting it 
      const fr = new FileReader();
      fr.onload = () => {
        const dataUrl = fr.result.toString();
        this.selectedImage = dataUrl;
        this.imagePick.emit(chosenFile);
      };
      fr.readAsDataURL(chosenFile);
      console.log(event);
  }

}
