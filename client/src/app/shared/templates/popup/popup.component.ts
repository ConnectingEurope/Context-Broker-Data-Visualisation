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

    public ngOnInit(): void {
        this.attrs = Object.entries(this.entity).filter(a => typeof a[1] !== 'object').map(a => [a[0], this.transformAttr(a[1])]);
    }

    private transformAttr(attr: any): any {
        const dateExp: RegExp = new RegExp(/.*-.*-.*:.*:.*\..*Z/);
        if (dateExp.test(attr)) {
            return moment(attr).format('DD/MM/YYYY HH:mm:ss');
        }
        return attr;
    }

}
