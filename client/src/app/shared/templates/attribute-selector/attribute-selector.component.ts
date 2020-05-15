import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { BaseComponent } from '../../misc/base.component';
import { TreeNode } from 'primeng/api/treenode';

@Component({
    selector: 'app-attribute-selector',
    templateUrl: './attribute-selector.component.html',
    styleUrls: ['./attribute-selector.component.scss'],
})
export class AttributeSelectorComponent extends BaseComponent {

    @Input() public entities: TreeNode[];
    @Input() public selectedEntities: TreeNode[];
    @Output() public selectedEntitiesChange: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();
    @Output() public favChange: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('entitiesScroll') private entitiesScroll: ScrollPanel;

    constructor() {
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
        this.selectedEntitiesChange.emit(this.selectedEntities);
    }

    public onNodeUnselect(event: any): void {
        event.node.parent ? event.node.data.fav = false : event.node.children.forEach(n => n.data.fav = false);
        this.selectedEntitiesChange.emit(this.selectedEntities);
    }

    public onClickFav(event: any, node: TreeNode): void {
        event.stopPropagation();
        node.parent.children.forEach(c => c.data.fav = false);
        node.data.fav = true;
        this.favChange.emit();
    }

    public onClickUnfav(event: any, node: TreeNode): void {
        event.stopPropagation();
        node.data.fav = false;
        this.favChange.emit();
    }

}
