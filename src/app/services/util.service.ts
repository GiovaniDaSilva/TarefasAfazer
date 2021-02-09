import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toastCtrl : ToastController,
              private loadCtrl : LoadingController,
              private alertCtrl : AlertController) { }

  loading : any;

  async showToast(mensagem : string, duracao : number = 2000){
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: duracao,
      cssClass: 'animate__animated animate__pulse',
      color: 'danger',
      position: 'top'
    })
    toast.present();
  }

  async showLoading(mensagem:string = 'Processando'){
    let loadind = await this.loadCtrl.create({message: mensagem});

    this.loading = loadind;

    this.loading.present();
  }

  hideLoad(){
    console.log(this.loading);
    if (this.loading != undefined && this.loading != null){
      this.loading.dismiss();
    }
  }


  async Confirmar(mensagem : string) {
    let retorno : boolean = false
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirma',
      message: mensagem,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            return false            
          }
        }, {
          text: 'Ok',        
          handler: () => {            
            console.log('Confirm Okay');
            retorno = true;
          }          
        }
      ]
    });

    await alert.present();
    return retorno;
  }

}
