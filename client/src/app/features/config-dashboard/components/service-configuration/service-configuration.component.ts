import { Component, Input, ViewChild } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';
import { ContextBrokerForm } from '../../models/context-broker-form';
import { EntityDto } from '../../models/entity-dto';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-service-configuration',
  templateUrl: './service-configuration.component.html',
  styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent {

  @Input() public cb: ContextBrokerForm;

  @ViewChild('entitiesScroll', { static: false }) private entitiesScroll: ScrollPanel;

  constructor(
    private configDashboardService: ConfigDashboardService,
    private appMessageService: AppMessageService,
    private layerService: LayerService,
    private confirmationService: ConfirmationService,
  ) {
    super();
  }

  protected onAddService(): void {
    this.cb.services.unshift({
      header: this.configDashboardService.defaulServiceHeader,
      form: this.configDashboardService.createServiceForm(),
      entities: [],
      selectedEntities: [],
    });
  }

  protected onRemoveService(index: number): void {
    this.confirmationService.confirm({
      icon: 'pi pi-info',
      header: 'Are you sure you want to delete this service?',
      message: 'All the configuration of this service will be deleted.',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: (): void => {
        this.removeService(index);
      },
    });
  }

  protected onServiceConfigChange(index: number): void {
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;
    const header: string = service + (service && servicePath ? servicePath : '');
    this.cb.services[index].header = header && !/^\s+$/.test(service) ? header :
      this.configDashboardService.serviceHeaderWhenEmpty;
  }

  protected refreshEntitiesScroll(): void {
    setTimeout(() => {
      this.entitiesScroll.refresh();
    });
  }

  protected isDisabledChooseButton(index: number): boolean {
    return this.cb.form.get('url').invalid ||
      this.cb.services[index].form.get('service').invalid ||
      this.cb.services[index].form.get('servicePath').invalid;
  }

  protected onChooseEntities(index: number): void {
    const url: string = this.cb.form.value.url;
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;

    this.configDashboardService.getEntitiesFromService(url, service, servicePath).pipe(takeUntil(this.destroy$)).subscribe(
      entities => {
        entities.length > 0 ? this.onChooseEntitiesSuccess(entities, index) : this.onChooseEntitiesFail(index);
      },
      err => {
        this.onChooseEntitiesFail(index);
      });
  }

  private removeService(index: number): void {
    this.cb.services.splice(index, 1);
  }

  private onChooseEntitiesSuccess(entities: EntityDto[], index: number): void {
    this.cb.services[index].entities = this.layerService.getEntities(entities);
    this.cb.services[index].selectedEntities = this.layerService.getAllSelected(this.cb.services[index].entities);
  }

  private onChooseEntitiesFail(index: number): void {
    this.cb.services[index].entities = [];
    this.cb.services[index].selectedEntities = [];
    this.appMessageService.add({
      severity: 'warn',
      summary: 'Entities not found in this service',
      detail: 'Try with another service or without using services in general configuration',
    });
  }

}
