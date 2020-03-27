import { FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api/treenode';

export interface ServiceForm {
    header: string;
    form: FormGroup;
    entities: TreeNode[];
    selectedEntities: TreeNode[];
}

export interface ContextBrokerForm {
    header: string;
    form: FormGroup;
    historicalForm: FormGroup;
    services: ServiceForm[];
    entities: TreeNode[];
    selectedEntities: TreeNode[];
}
