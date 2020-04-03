export interface CategoryDto {
    name: string;
    icon: L.Icon;
    entities: CategoryEntityDto[];
}

export interface CategoryEntityDto {
    name: string;
    selected: boolean;
    attrs: AttributeDto[];
}

export interface AttributeDto {
    name: string;
    selected: string;
}

export interface ActionDto {
    label: string;
}

