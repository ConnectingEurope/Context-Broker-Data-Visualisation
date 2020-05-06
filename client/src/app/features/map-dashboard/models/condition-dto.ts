export interface IConditionDto {
    category: string;
    entity: string;
    attribute: string;
    condition?: string;
    value: string;
    selected: boolean;
}

export class ConditionDto {
    public category: string;
    public entity: string;
    public attribute: string;
    public condition?: string;
    public value: string;
    public selected: boolean;

    constructor(category: string, entity: string, attribute: string, condition: string, value: string) {
        this.category = category;
        this.entity = entity;
        this.attribute = attribute;
        this.condition = condition;
        this.value = value;
        this.selected = true;
    }
}
