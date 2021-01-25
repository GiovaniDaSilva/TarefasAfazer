import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tarefas: any[] = [
    { name: "Estudar Ionic", done: false },
    { name: "Estudar Inglês",  done: false },
    { name: "Continuar Guia de Estudos",  done: false },
  ]

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  async novaTarefa() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: '...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            console.log('Adicionar tarefa' + form);
            this.add(form.newTask)
          }
        }
      ]
    });

    await alert.present();
  }

  async add(newTask: string) {

    //Valida se preencheu a task
    if (newTask.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'top'
      })
      toast.present();
      return
    }

    let task = { name: newTask, done: false }
    this.tarefas.push(task)

    this.updateLocalStorege();
  }

  showAdd() {
    console.log('showAdd')
    this.novaTarefa()
  }

  removeTask(task) {
    console.log('removeTask ' + task)
  }


  updateLocalStorege(){
    localStorage.setItem('taskDb', JSON.stringify(this.tarefas));
  }
}
