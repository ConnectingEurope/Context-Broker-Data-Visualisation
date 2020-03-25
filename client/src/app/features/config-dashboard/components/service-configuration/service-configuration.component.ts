import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { MessageService, TreeNode } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';
import { ContextBrokerForm } from '../../models/context-broker-form';
import { EntityDto } from '../../models/entity-dto';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';

@Component({
  selector: 'app-service-configuration',
  templateUrl: './service-configuration.component.html',
  styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent {

  @Input() public cb: ContextBrokerForm;

  private defaultHeader: string = 'New Service';

  @ViewChild('entitiesScroll', { static: false }) private entitiesScroll: ScrollPanel;

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
    private layerService: LayerService,
  ) {
    super();
  }

  protected onAddService(): void {
    this.cb.services.unshift({
      header: this.defaultHeader,
      form: new FormGroup({
        service: new FormControl(''),
        servicePath: new FormControl(''),
      }),
      entities: [],
      selectedEntities: [],
    });
  }

  protected onRemoveService(index: number): void {
    this.cb.services.splice(index, 1);
  }

  protected onServiceConfigChange(index: number): void {
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;

    this.cb.services[index].header = service + (service && servicePath ? servicePath : '');
  }

  protected refreshEntitiesScroll(): void {
    setTimeout(() => {
      this.entitiesScroll.refresh();
    });
  }

  protected onChooseEntities(index: number): void {
    const url: string = this.cb.form.value.url;
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;

    this.configDashboardService.getEntitiesFromService(url, service, servicePath).pipe(takeUntil(this.destroy$)).subscribe(
      entities => {
        entities.length > 0 ? this.onChooseEntitiesSuccess(entities, index) : this.onChooseEntitiesFail();
      },
      err => {
        this.onChooseEntitiesFail();
      });
  }

  private onChooseEntitiesSuccess(entities: EntityDto[], index: number): void {
    this.cb.services[index].entities = this.layerService.getEntities(entities);
    this.cb.services[index].selectedEntities = this.layerService.getAllLayers(this.cb.services[index].entities);
  }

  private onChooseEntitiesFail(): void {
    this.messageService.clear();
    this.messageService.add({
      severity: 'warn',
      summary: 'Entities not found in this service',
      detail: 'Try with another service or without using services in general configuration',
    });
  }

}
