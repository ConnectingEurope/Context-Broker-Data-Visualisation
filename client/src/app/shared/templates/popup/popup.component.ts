import { Component, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { Router } from '@angular/router';
import { ModelDto } from '../../models/model-dto';
import { EntityMetadataResolverService } from '../../services/entity-metadata-resolver-service';
import { EntityMetadata } from '../../models/entity-metadata';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {

    @Input() public entity: any;
    @Input() public modelDto: ModelDto;
    protected attrs: any;
    private maxNumberChars: number = 35;
    @ViewChild('scrollPanel', { static: false }) private scrollPanel: ScrollPanel;

    constructor(
        private router: Router,
        private entityMetadataResolver: EntityMetadataResolverService,
    ) {

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

    protected onClickStats(): void {
        const entityMetadata: EntityMetadata = {
            id: this.entity.id,
            type: this.modelDto.type,
            attrs: Object.keys(this.entity),
            cometUrl: this.modelDto.cometUrl,
            service: this.modelDto.service,
            servicePath: this.modelDto.servicePath,
        };
        this.entityMetadataResolver.setEntityMetadata(entityMetadata);
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
