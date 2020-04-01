import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConditionDto } from '../../models/condition-dto';

@Component({
    selector: 'app-layer-conditions',
    templateUrl: './layer-conditions.component.html',
    styleUrls: ['./layer-conditions.component.scss'],
})
export class LayerConditionsComponent implements OnInit {

    public categorySelected: any = [];
    public entitySelected: any = [];
    public actionSelected: any = [];
    public textSelected: string;
    public attrSelected: any;
    public actions: any[] = [{ label: '<' }, { label: '<=' }, { label: '=' }, { label: '>=' }, { label: '>' }];

    public filterList: ConditionDto[] = [];

    public entities: any[] = [
        {
            name: 'AirQualityObserved',
            selected: true,
            attrs: [
                {
                    name: 'BEN',
                    selected: true,
                },
                {
                    name: 'CH4',
                    selected: true,
                },
                {
                    name: 'dataProvider',
                    selecte: true,
                },
            ],
        },
        {
            name: 'OffStreetParking',
            selected: true,
            attrs: [
                {
                    name: 'Parking',
                    selected: true,
                },
            ],
        },
    ];

    @Output()
    public eventFilters: EventEmitter<ConditionDto[]> = new EventEmitter();

    @Input()
    public readonly layers: any;

    constructor() { }

    public ngOnInit(): void {
    }

    public add(): void {
        if (this.categorySelected.label && this.entitySelected.label && this.attrSelected.name &&
            this.actionSelected && this.textSelected) {

            this.filterList.push(
                new ConditionDto(
                    this.categorySelected.label,
                    this.entitySelected.label,
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
        this.categorySelected = [];
        this.entitySelected = [];
        this.actionSelected = [];
        this.attrSelected = [];
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

    protected getAttributes(): any[] {
        if (this.entitySelected) {
            // TODO: Call to entities service
            return this.entities.find(elem => {
                return elem.name === this.entitySelected.data;
            }).attrs;
        }
    }

}
