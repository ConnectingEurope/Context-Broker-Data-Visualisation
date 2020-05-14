import { EntityFilter, CategoryFilter, AttributeFilter } from '../../models/category-filter';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActionFilter } from '../../models/action-filter';
import { ConditionFilter } from '../../models/condition-filter';
import { Utils } from 'src/app/shared/misc/utils';

@Component({
    selector: 'app-layer-conditions',
    templateUrl: './layer-conditions.component.html',
    styleUrls: ['./layer-conditions.component.scss'],
})
export class LayerConditionsComponent implements OnInit {

    @Input() public entities: EntityFilter[];
    @Input() public categories: CategoryFilter[];
    @Output() public eventFilters: EventEmitter<ConditionFilter[]> = new EventEmitter();

    public categorySelected: CategoryFilter = undefined;
    public entitySelected: EntityFilter = undefined;
    public actionSelected: ActionFilter = undefined;
    public textSelected: string;
    public attrSelected: AttributeFilter;
    public actionsString: string[] = ['contains', '<', '<=', '=', '>=', '>'];
    public actions: ActionFilter[];
    public filterList: ConditionFilter[] = [];

    private maxLabelChar: number = 55;
    private maxDropdownChar: number = 20;

    public ngOnInit(): void {
        this.actions = this.actionsString.map(a => ({ label: a }));
    }

    public add(): void {
        if (Utils.getListObjectsSafely('name', this.categorySelected, this.entitySelected, this.attrSelected) &&
            this.actionSelected && this.textSelected !== undefined) {

            this.filterList.push({
                category: this.categorySelected.name,
                entity: this.entitySelected.name,
                attribute: this.attrSelected.name,
                condition: this.actionSelected.label,
                value: this.textSelected,
                selected: true,
            });

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

    public getFilterLabel(filter: ConditionFilter): string {
        const label: string = filter.entity + ' - ' + filter.attribute + ' ' + filter.condition + ' ' + filter.value;
        return Utils.truncateString(label, this.maxLabelChar);
    }

    public getTruncatedEntities(entityFilters: EntityFilter[]): EntityFilter[] {
        entityFilters.forEach(e => e.label = Utils.truncateString(e.label, this.maxDropdownChar));
        return entityFilters;
    }

    public getTruncatedAttributes(attributeFilters: AttributeFilter[]): AttributeFilter[] {
        attributeFilters.forEach(a => a.name = Utils.truncateString(a.name, this.maxDropdownChar));
        return attributeFilters;
    }

}
