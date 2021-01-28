import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  key_storage = 'taskDb';

  tarefas: any[] = [
    { name: "Estudar Ionic", done: false },
    { name: "Estudar Inglês",  done: false},
    { name: "Continuar Guia de Estudos",  done: false},
  ]

  constructor(private alertCtrl: AlertController,
              private toastCtrl: ToastController, 
              private actStCtrl: ActionSheetController) {
      let tasksJson = localStorage.getItem(this.key_storage);
      
      if (tasksJson!='[]'){
        this.tarefas = JSON.parse(tasksJson)
      }
   }

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

    let task = { name: newTask, done: false}
    this.tarefas.push(task)

    this.updateLocalStorege();
  }

  showAdd() {
    console.log('showAdd')
    this.novaTarefa()
  }

  removeTask(task : any, id :any) {        
    document.getElementById('task' + id).setAttribute("class", "animate__animated animate__fadeOutDown");  
    //Necessário um timer antes de remover da lista, para dar o tempo da animação da div
    let time =  setTimeout(() => {
      this.tarefas = this.tarefas.filter(taskArray=> taskArray != task)
      this.updateLocalStorege()
    }, 500)

  }

  updateLocalStorege(){
    localStorage.setItem(this.key_storage, JSON.stringify(this.tarefas));
  }

  openActions(task){
    console.log(task)
    this.presentActionSheet(task)
  }

  async presentActionSheet(task: any) {
    const actionSheet = await this.actStCtrl.create({
      header: 'O que deseja fazer?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar' ,        
        icon: task.done ?  'arrow-redo': 'arrow-undo' ,
        handler: () => {
          task.done = !task.done
          this.updateLocalStorege();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


}
