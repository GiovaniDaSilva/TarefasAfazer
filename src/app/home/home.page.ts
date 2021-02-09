import { UtilService } from './../services/util.service';
import { TarefasService } from './../services/tarefas.service';
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  key_storage = 'taskDb';

  tarefas: any[] = [];
  processando: boolean = false;

  constructor(private alertCtrl: AlertController,
    private actStCtrl: ActionSheetController,
    private tarefaSrv: TarefasService,
    private util: UtilService,
    private loadingCtrl: LoadingController) {
    //let tasksJson = localStorage.getItem(this.key_storage);

    //if (tasksJson != null && tasksJson!='[]' ){
    // this.tarefas = JSON.parse(tasksJson)
    //}
    this.CarregarTarefas();
  }


  async CarregarTarefas() {
    this.processando = true;
    let loading = await this.loadingCtrl.create({ message: 'Carregando atividades.' })
    loading.present()
    this.tarefaSrv.list()
      .then(async (resposta: any[]) => {
        loading.dismiss();
        this.tarefas = resposta;
        console.table(resposta);
        this.processando = false;
      })
      .catch(async (erro) => {
        loading.dismiss();
        this.util.showToast('Operação falhou');
        console.error(erro)
        this.processando = false;
      })
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
      this.util.showToast('Informe o que deseja fazer!');
      return
    }



    this.util.showLoading();

    this.tarefaSrv.adicionar(newTask)
      .then(async (resposta) => {
        this.util.hideLoad();
        this.util.showToast('Operação realizada com sucesso.');

        //let task = { nome: newTask, done: false }
        //this.tarefas.push(task)

        this.CarregarTarefas();
        console.log(resposta)
      })
      .catch(async (erro) => {

        this.util.showToast('Operação falhou.');
        this.util.hideLoad();
        console.error(erro)
      })
    // this.updateLocalStorege();
  }

  showAdd() {
    console.log('showAdd')
    this.novaTarefa()
  }

  async removeTask(task: any, id: any) {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirma',
      message: 'Deseja Excluir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

          }
        }, {
          text: 'Ok',
          handler: () => {
            //this.updateLocalStorege()
            this.util.showLoading();
            this.tarefaSrv.delete(task.id)
              .then(async (resposta) => {
                console.log(resposta)
                //this.CarregarTarefas();
                this.util.hideLoad();


                document.getElementById('task' + id).setAttribute("class", "animate__animated animate__fadeOutDown");
                let time = setTimeout(() => {
                  this.tarefas = this.tarefas.filter(taskArray => taskArray != task)
                }, 1000)

              })
              .catch(async (erro) => {
                this.util.hideLoad();
                this.util.showToast('Operação falhou.')
                console.error(erro)
              })


          }
        }
      ]
    });

    await alert.present();

  }

  updateLocalStorege() {
    localStorage.setItem(this.key_storage, JSON.stringify(this.tarefas));
  }

  openActions(task) {
    console.log(task)
    this.presentActionSheet(task)
  }

  async presentActionSheet(task: any) {
    const actionSheet = await this.actStCtrl.create({
      header: 'O que deseja fazer?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'arrow-redo' : 'arrow-undo',
        handler: () => {
          task.done = !task.done
          this.util.showLoading();
          this.tarefaSrv.atualizar(task)
            .then(async (resposta) => {
              this.util.showToast('Operação realizada com sucesso.');
              this.util.hideLoad();
              this.CarregarTarefas();
              console.log(resposta)
            })
            .catch(async (erro) => {
              this.util.hideLoad();
              this.util.showToast('Operação falhou.');
              console.error(erro)
            })

          //this.updateLocalStorege();
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
