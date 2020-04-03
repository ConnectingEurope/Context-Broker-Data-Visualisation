import { CategoryEntityDto, CategoryDto, ActionDto, AttributeDto } from './../../models/model-dto';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConditionDto } from '../../models/condition-dto';

@Component({
    selector: 'app-layer-conditions',
    templateUrl: './layer-conditions.component.html',
    styleUrls: ['./layer-conditions.component.scss'],
})
export class LayerConditionsComponent implements OnInit {

    public categorySelected: CategoryDto = undefined;
    public entitySelected: CategoryEntityDto = undefined;
    public actionSelected: ActionDto = undefined;
    public textSelected: string;
    public attrSelected: AttributeDto;
    public actions: ActionDto[] = [{ label: 'contains' }, { label: '<' }, { label: '<=' }, { label: '=' }, { label: '>=' }, { label: '>' }];

    public filterList: ConditionDto[] = [];

    @Input()
    public entities: CategoryEntityDto[];
    @Input()
    public categories: CategoryDto[];

    @Output()
    public eventFilters: EventEmitter<ConditionDto[]> = new EventEmitter();

    constructor() { }

    public ngOnInit(): void {
    }

    public add(): void {
        if (this.categorySelected.name && this.entitySelected.name && this.attrSelected.name &&
            this.actionSelected && this.textSelected) {

            this.filterList.push(
                new ConditionDto(
                    this.categorySelected.name,
                    this.entitySelected.name,
                    this.attrSelected.name,
                    +this.textSelected ? this.actionSelected.label : 'contains',
                    this.textSelected,
                ),
            );

            this.clear();
            this.emitFilterList();
        }
    }

    public clear(): void {
        this.categorySelected = undefined;
        this.entitySelected = undefined;
        this.actionSelected = undefined;
        this.attrSelected = undefined;
        this.textSelected = undefined;
    }

    public clearAll(): void {
        this.filterList = [];
        this.emitFilterList();
    }

    public clearFilter(index: number): void {
        this.filterList.splice(index, 1);
        this.emitFilterList();
    }

    public emitFilterList(): void {
        this.eventFilters.emit(this.filterList);
    }

}
