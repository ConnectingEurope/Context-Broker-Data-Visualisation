import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-json-dialog',
    templateUrl: './json-dialog.component.html',
    styleUrls: ['./json-dialog.component.scss'],
    providers: [JsonPipe],
})
export class JsonDialogComponent {

    @Input() public display: boolean;
    @Input() public header: string;
    @Input() public content: any;
    @Output() public hide: EventEmitter<void> = new EventEmitter<void>();
    public maxHeaderChar: number = 45;

    constructor(
        private clipboardService: ClipboardService,
        private jsonPipe: JsonPipe,
    ) {
    }

    public onClickCopy(): void {
        this.clipboardService.copyFromContent(this.jsonPipe.transform(this.content));
    }

    public onHide(): void {
        this.hide.emit();
    }

}
