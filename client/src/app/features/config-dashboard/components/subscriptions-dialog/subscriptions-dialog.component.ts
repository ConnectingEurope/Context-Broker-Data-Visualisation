import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { JsonPipe } from '@angular/common';
import { TreeNode } from 'primeng/api/treenode';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';

export interface ContextSubscription {
    subject: {
        entities: ContextEntitySubscription[],
    };
    notification: {
        attrs: string[],
    };
}

export interface ContextEntitySubscription {
    id?: string;
    idPattern?: string;
    type: string;
}

@Component({
    selector: 'app-subscriptions-dialog',
    templateUrl: './subscriptions-dialog.component.html',
    styleUrls: ['./subscriptions-dialog.component.scss'],
    providers: [JsonPipe],
})
export class SubscriptionsDialogComponent {

    @Input() public display: boolean;
    @Output() public hide: EventEmitter<void> = new EventEmitter<void>();

    public subs: TreeNode[] = [];
    private content: ContextSubscription[];

    @ViewChild('entitiesScroll') private entitiesScroll: ScrollPanel;

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

    public updateContent(content: ContextSubscription[]): void {
        this.content = content;
        this.subs = [];
        this.content.forEach(s => {
            s.subject.entities.forEach(e => {
                this.subs.push({
                    label: e.type + this.getIdOrIdPattern(e),
                    children: s.notification.attrs.map(a => ({ label: a })),
                });
            });
        });
    }

    public refreshScroll(): void {
        setTimeout(() => {
            this.entitiesScroll.refresh();
        });
    }

    private getIdOrIdPattern(entity: ContextEntitySubscription): string {
        let id: string = '';
        if (entity.id) { id = entity.id; }
        if (entity.idPattern) { id = entity.idPattern; }
        return id ? ' - ' + id : id;
    }

}
