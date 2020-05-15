import { Injectable } from '@angular/core';
import { MessageService, Message } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class AppMessageService {

    constructor(private messageService: MessageService) { }

    public add(message: Message): void {
        this.messageService.clear();
        this.messageService.add(message);
    }

}
