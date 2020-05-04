import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { Router } from '@angular/router';
import { ModelDto } from '../../models/model-dto';
import { EntityMetadataService } from '../../services/entity-metadata-service';
import { EntityMetadata } from '../../models/entity-metadata';
import { BaseComponent } from '../../misc/base.component';
import { takeUntil } from 'rxjs/operators';
import { TreeNode } from 'primeng/api/treenode';

@Component({
    selector: 'app-attribute-selector',
    templateUrl: './attribute-selector.component.html',
    styleUrls: ['./attribute-selector.component.scss'],
})
export class AttributeSelectorComponent extends BaseComponent {

    @Input() public entities: TreeNode[];
    @Input() public selectedEntities: TreeNode[];
    @Output() public selectedEntitiesChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() public favChange: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('entitiesScroll') private entitiesScroll: ScrollPanel;

    constructor(
        private router: Router,
        private entityMetadataService: EntityMetadataService,
    ) {
        super();
    }

    public refreshScroll(): void {
        setTimeout(() => {
            this.entitiesScroll.refresh();
        });
    }

    public shouldButtonFavBeDisplayed(node: TreeNode, selectedEntities: TreeNode[]): boolean {
        return node.data.fav !== undefined && selectedEntities.some(e => {
            return e.parent && node.parent && e.parent.label === node.parent.label && e.label === node.label;
        });
    }

    public onNodeSelect(event: any): void {
        this.selectedEntitiesChange.emit();
    }

    public onNodeUnselect(event: any): void {
        if (event.node.data.fav) { event.node.data.fav = false; }
        this.selectedEntitiesChange.emit();
    }

    public onClickFav(event: any, node: TreeNode): void {
        event.stopPropagation();
        node.parent.children.forEach(c => {
            c.data.fav = false;
        });
        node.data.fav = true;
        this.favChange.emit();
    }

    public onClickUnfav(event: any, node: TreeNode): void {
        event.stopPropagation();
        node.data.fav = false;
        this.favChange.emit();
    }

}
