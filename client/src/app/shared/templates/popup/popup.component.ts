import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {

    @Input() public entity: any;

    protected attrs: any;
    private maxNumberChars: number = 45;

    public ngOnInit(): void {
        this.updateAttrs();
    }

    public setEntity(entity: any): void {
        this.entity = entity;
        this.updateAttrs();
    }

    private updateAttrs(): void {
        this.attrs = Object.entries(this.entity).filter(a => typeof a[1] !== 'object').map(a => [a[0], this.transformAttr(a[1])]);
    }

    private transformAttr(attr: any): any {
        const dateExp: RegExp = new RegExp(/.*-.*-.*:.*:.*\..*Z/);
        if (dateExp.test(attr)) {
            return moment(attr).format('DD/MM/YYYY HH:mm:ss');
        }
        if (typeof attr === 'string' && attr.length > this.maxNumberChars) {
            return attr.substring(0, this.maxNumberChars) + '...';
        }
        return attr;
    }

}
