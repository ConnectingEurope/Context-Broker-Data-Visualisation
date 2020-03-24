import { FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api/treenode';

export interface ContextBrokerServiceConfiguration {
    header: string;
    form: FormGroup;
    entities: TreeNode[];
    selectedEntities: TreeNode[];
}

export interface ContextBrokerConfiguration {
    header: string;
    form: FormGroup;
    services: ContextBrokerServiceConfiguration[];
    entities: TreeNode[];
    selectedEntities: TreeNode[];
}
