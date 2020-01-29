import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';


const CHAT_URL = 'ws://192.168.252.244:3000/';

export interface Message {
  operator: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: Rx.Subject<MessageEvent>;
  public messages: Rx.Subject<Message>;

  constructor() { 
    this.messages = <Rx.Subject<Message>>
      this.connect(CHAT_URL)
      .pipe(map((response: MessageEvent) => {
        const data = JSON.parse(response.data);
        console.log(data.Event)
        return data;
      }));
  }

  
  // создает соединение
  public connect(url: string): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Conectado correctamente a ' + url);
    }
    return this.subject;
  }

  private create(url: string): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}

// проверка данных