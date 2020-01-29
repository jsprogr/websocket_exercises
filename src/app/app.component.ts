import { Component } from '@angular/core';
import { WebsocketService } from './web.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // providers: [ WebsocketService, ChatService ]
})
export class AppComponent {
  mes: any[] = []
  
  constructor(private chatService: WebsocketService) {
    
    chatService.messages.subscribe(msg => {
      this.mes.push(JSON.stringify(msg))
    });
  }

  // private message = {
  //   author: 'ivanEspinosa',
  //   message: 'Mensaje de prueba'
  // };

  // sendMsg() {
  //   this.chatService.messages.next(this.message);
  //   this.message.message = '';
  // }

}