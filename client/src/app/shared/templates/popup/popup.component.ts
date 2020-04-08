import { Component, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {

    @Input() public entity: any;
    @Input() public cometUrl: string;
    protected attrs: any;
    private maxNumberChars: number = 35;
    @ViewChild('scrollPanel', { static: false }) private scrollPanel: ScrollPanel;

    constructor(
        private router: Router,
    ) {

    }

    public updatePopup(entity: any, cometUrl: string): void {
        this.entity = entity;
        this.cometUrl = cometUrl;
        this.updateAttrs();
    }

    public refreshScroll(): void {
        if (this.scrollPanel) {
            this.scrollPanel.refresh();
        }
    }

    protected onClickStats(): void {
        // TODO change this route for the proper route, passing entity and comet URL
        this.router.navigate(['/config-dashboard']);
    }

    protected onClickDebug(): void {
        // TODO
    }

    private updateAttrs(): void {
        this.attrs = Object.entries(this.entity).filter(a => typeof a[1] !== 'object').map(a => [a[0], this.transformAttr(a[0], a[1])]);
    }

    private transformAttr(key: string, value: any): any {
        const dateExp: RegExp = new RegExp(/.*-.*-.*:.*:.*\..*Z/);
        if (dateExp.test(value)) {
            return moment(value).format('DD/MM/YYYY HH:mm:ss');
        }
        if (typeof value === 'string' && key.length + value.length > this.maxNumberChars) {
            return value.substring(0, this.maxNumberChars - key.length) + '...';
        }
        return value;
    }

}
