import { Component, OnInit, Input } from '@angular/core';
import { LeafletIcons } from 'src/app/shared/misc/leaflet-icons';
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
  public attrSelected: any = [];
  public actions: any[] = [{ label: '<' }, { label: '<=' }, { label: '=' }, { label: '=>' }, { label: '>' }];

  public filterList: ConditionDto[] = [];

  @Input()
  public readonly layers: any;

  constructor() { }

  public ngOnInit(): void {
  }

  public add(): void {
    if (this.categorySelected.label && this.entitySelected.label && this.attrSelected.label &&
      this.actionSelected && this.textSelected) {

      this.filterList.push(
        new ConditionDto(
          this.categorySelected.label,
          this.entitySelected.label,
          this.attrSelected.label,
          this.actionSelected.label,
          this.textSelected,
        ),
      );

      this.clear();
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
  }

}
