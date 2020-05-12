import { TreeNode } from 'primeng/api/treenode';
import { Injectable } from '@angular/core';
import { EntityDto } from 'src/app/features/config-dashboard/models/entity-dto';
import { EntityConfiguration, AttrConfiguration } from 'src/app/features/config-dashboard/models/context-broker-configuration';

@Injectable({
    providedIn: 'root',
})
export class EntityTreeNodeService {

    private defaultAttrsConf: AttrConfiguration[] = [
        { name: 'id', selected: true, fav: false },
        { name: 'type', selected: true, fav: false },
    ];

    public convertEntitiesToNodes(entities: EntityDto[]): TreeNode[] {
        const entitiesTree: TreeNode[] = [];

        entities.forEach(e => {
            entitiesTree.push({
                data: e.type,
                label: e.type,
                children: Object.keys(e.attrs).filter(a => a !== 'location').map((a: string) => ({
                    data: { name: a, fav: false },
                    label: a,
                    parent: { data: e.type },
                } as TreeNode)),
            });
        });

        return entitiesTree;
    }

    public convertEntitiesConfToNodes(entities: EntityConfiguration[]): { treeNodes: TreeNode[], selectedTreeNodes: TreeNode[] } {
        const treeN: TreeNode[] = [];
        const selectedTreeN: TreeNode[] = [];

        entities.forEach(e => {
            const treeNodeChildren: TreeNode[] = [];
            e.attrs.forEach(a => {
                this.convertAttrConfToNodes(a, e, treeNodeChildren, selectedTreeN);
            });
            const treeNode: TreeNode = { data: e.name, label: e.name, children: treeNodeChildren };
            treeN.push(treeNode);
            if (e.selected) {
                this.checkIfTreeNodeIsPartialSelected(treeNode, e);
                selectedTreeN.push(treeNode);
            }
        });

        return { treeNodes: treeN, selectedTreeNodes: selectedTreeN };
    }

    public convertNodesToEntitiesConf(treeNodes: TreeNode[], selectedTreeNodes: TreeNode[]): EntityConfiguration[] {
        return treeNodes.map(t => {
            return {
                name: t.data,
                selected: this.isTreeNodeSelected(t, selectedTreeNodes),
                attrs: this.defaultAttrsConf.concat(t.children.map(c => ({
                    name: c.data.name,
                    selected: this.isTreeNodeSelected(c, selectedTreeNodes),
                    fav: c.data.fav,
                }))),
            };
        });
    }

    private convertAttrConfToNodes(a: AttrConfiguration, e: EntityConfiguration, children: TreeNode[], selectedN: TreeNode[]): void {
        if (a.name !== 'id' && a.name !== 'type' && a.name !== 'location') {
            const treeNodeChild: TreeNode = {
                data: { name: a.name, fav: a.fav },
                label: a.name,
                parent: { data: e.name },
            };
            children.push(treeNodeChild);
            if (a.selected) { selectedN.push(treeNodeChild); }
        }
    }

    private checkIfTreeNodeIsPartialSelected(treeNode: TreeNode, e: EntityConfiguration): void {
        if (e.attrs.some(a => !a.selected)) {
            treeNode.partialSelected = true;
        }
    }

    private isTreeNodeSelected(treeNode: TreeNode, selectedTreeNodes: TreeNode[]): boolean {
        return treeNode.partialSelected || selectedTreeNodes.some(t => treeNode === t);
    }

}
