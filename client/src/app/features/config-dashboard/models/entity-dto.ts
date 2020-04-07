import { FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api/treenode';

export interface EntityDto {
    type: string;
    attrs: {
        [key: string]: {
            types: string[];
        };
    };
}
