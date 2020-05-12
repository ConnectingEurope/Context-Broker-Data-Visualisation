import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { Router } from '@angular/router';
import { ModelDto } from '../../models/model-dto';
import { EntityMetadataService } from '../../services/entity-metadata-service';
import { BaseComponent } from '../../misc/base.component';
import { takeUntil } from 'rxjs/operators';
import { Entity } from '../../models/entity';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent extends BaseComponent {

    @Input() public entity: Entity;
    @Input() public modelDto: ModelDto;
    @Output() public clickDebug: EventEmitter<void> = new EventEmitter<void>();

    public maxNumberAttrsUntilScroll: number = 10;
    public attrs: any[];

    private maxNumberChars: number = 30;

    @ViewChild('scrollPanel') private scrollPanel: ScrollPanel;

    constructor(
        private router: Router,
        private entityMetadataService: EntityMetadataService,
    ) {
        super();
    }

    public updatePopup(entity: any, modelDto: ModelDto): void {
        this.entity = entity;
        this.modelDto = modelDto;
        this.updateAttrs();
    }

    public refreshScroll(): void {
        if (this.scrollPanel) {
            this.scrollPanel.refresh();
        }
    }

    public onClickStats(): void {
        this.entityMetadataService.setEntityMetadata(this.entity, this.modelDto).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.router.navigate(['/historical-data', this.modelDto.type, this.entity.id]);
        });
    }

    public onClickDebug(): void {
        this.clickDebug.emit();
    }

    private updateAttrs(): void {
        this.attrs = Object.entries(this.entity).filter(a => a[0] !== 'location').map(a => [a[0], this.transformAttr(a[0], a[1])]);
    }

    private transformAttr(key: string, value: any): any {
        let v: any = value;
        const dateExp: RegExp = new RegExp(/.*-.*-.*:.*:.*\..*Z/);

        if (dateExp.test(v)) { return moment(v).format('DD/MM/YYYY HH:mm:ss'); }
        if (typeof v === 'object') { v = JSON.stringify(v); }
        if (typeof v === 'string' && (key.length + v.length) > this.maxNumberChars) {
            return v.substring(0, this.maxNumberChars - key.length) + '...';
        }

        return value;
    }

}
