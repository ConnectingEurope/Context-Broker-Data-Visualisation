import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { ContextBrokerForm, ServiceForm } from '../models/context-broker-form';
import { ContextBrokerConfiguration, ServiceConfiguration } from '../models/context-broker-configuration';
import { LayerService } from '../../map-dashboard/services/layer-service/layer-service';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent extends BaseComponent implements OnInit {

  protected configurationLoaded: boolean = false;
  protected addedAtLeastOnce: boolean = false;
  protected contextBrokers: ContextBrokerForm[] = [];

  constructor(
    private configDashboardService: ConfigDashboardService,
    private appMessageService: AppMessageService,
    private layerService: LayerService,
    private confirmationService: ConfirmationService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.configDashboardService.getConfiguration().pipe(takeUntil(this.destroy$)).subscribe(
      contextBrokers => {
        this.loadConfiguration(contextBrokers);
        this.configurationLoaded = true;
      },
      err => {
        this.appMessageService.add({ severity: 'error', summary: 'Cannot load the configuration' });
      },
    );
  }

  protected onAddContextBroker(): void {
    this.addedAtLeastOnce = true;
    this.contextBrokers.unshift({
      header: this.configDashboardService.defaultContextName,
      form: this.configDashboardService.createContextBrokerForm(),
      services: [],
      entities: [],
      selectedEntities: [],
    });
  }

  protected onRemoveContextBroker(index: number): void {
    this.confirmationService.confirm({
      icon: 'pi pi-info',
      header: 'Are you sure you want to delete this context broker?',
      message: 'All the configuration of this context broker will be deleted, including services and historical data.',
      accept: (): void => {
        this.removeContextBroker(index);
      },
    });
  }

  protected onApplyConfiguration(): void {
    if (!this.contextBrokers.every(cb => cb.form.valid)) {
      this.onInvalidConfiguration();
    } else {
      this.onValidConfiguration();
    }
  }

  private removeContextBroker(index: number): void {
    this.contextBrokers.splice(index, 1);
  }

  private onInvalidConfiguration(): void {
  }

  private onValidConfiguration(): void {
    const config: ContextBrokerConfiguration[] = this.getContextBrokers();
    this.configDashboardService.postConfiguration(config).pipe(takeUntil(this.destroy$)).subscribe(
      res => {
        this.appMessageService.add({ severity: 'success', summary: 'Configuration correctly applied' });
      },
      err => {
        this.appMessageService.add({ severity: 'error', summary: 'Cannot apply the configuration' });
      });
  }

  private getContextBrokers(): ContextBrokerConfiguration[] {
    return this.contextBrokers.map(cb => {
      const needServicesBool: boolean = cb.form.get('needServices').value;
      const needHistoricalDataBool: boolean = cb.form.get('needHistoricalData').value;
      return {
        name: cb.form.get('name').value,
        url: cb.form.get('url').value,
        needServices: needServicesBool,
        needHistoricalData: needHistoricalDataBool,
        cygnus: needHistoricalDataBool ? cb.form.get('cygnus').value : '',
        comet: needHistoricalDataBool ? cb.form.get('comet').value : '',
        entities: this.layerService.treeNodesToEntitiesConfiguration(cb.entities, cb.selectedEntities),
        services: needServicesBool ? this.getServices(cb) : [],
      };
    });
  }

  private getServices(cb: ContextBrokerForm): ServiceConfiguration[] {
    return cb.services.map(s => {
      return {
        service: s.form.get('service').value,
        servicePath: s.form.get('servicePath').value,
        entities: this.layerService.treeNodesToEntitiesConfiguration(s.entities, s.selectedEntities),
      };
    });
  }

  private loadConfiguration(contextBrokers: ContextBrokerConfiguration[]): void {
    contextBrokers.forEach(cb => {
      const { treeNodes, selectedTreeNodes }: any = this.layerService.entitiesConfigurationToTreeNodes(cb.entities);
      this.contextBrokers.unshift({
        header: cb.name,
        form: this.configDashboardService.createContextBrokerFormFromConfig(cb),
        services: this.loadServiceConfiguration(cb),
        entities: treeNodes,
        selectedEntities: selectedTreeNodes,
      });
    });
  }

  private loadServiceConfiguration(cb: ContextBrokerConfiguration): ServiceForm[] {
    return cb.services.map(s => {
      const { treeNodes, selectedTreeNodes }: any = this.layerService.entitiesConfigurationToTreeNodes(s.entities);
      return {
        header: s.service + s.servicePath,
        form: this.configDashboardService.createServiceFormFromConfig(s),
        entities: treeNodes,
        selectedEntities: selectedTreeNodes,
      };
    });
  }

}
