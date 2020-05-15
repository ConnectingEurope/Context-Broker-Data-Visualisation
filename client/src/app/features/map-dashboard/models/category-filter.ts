export interface CategoryFilter {
    name: string;
    label: string;
    icon: string;
    entities: EntityFilter[];
}

export interface EntityFilter {
    name: string;
    label: string;
    selected: boolean;
    attrs: AttributeFilter[];
}

export interface AttributeFilter {
    name: string;
    selected: string;
}
