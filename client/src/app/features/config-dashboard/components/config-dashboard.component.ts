import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { MessageService, TreeNode } from 'primeng/api';
import { ContextBrokerConfiguration, ContextBrokerServiceConfiguration } from '../models/context-broker-configuration';
import { ContextBroker, ContextBrokerService, ContextBrokerEntity, Configuration } from '../models/context-broker';
import { LayerService } from '../../map-dashboard/services/layer-service/layer-service';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent extends BaseComponent implements OnInit {

  protected contextBrokers: ContextBrokerConfiguration[] = [];
  private defaultContextName: string = 'New Context Broker';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
    private layerService: LayerService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.configDashboardService.getConfiguration().pipe(takeUntil(this.destroy$)).subscribe(
      contextBrokers => {
        this.initConfiguration(contextBrokers);
      });
  }

  protected onAddContextBroker(): void {
    this.contextBrokers.unshift({
      header: this.defaultContextName,
      form: new FormGroup({
        name: new FormControl(this.defaultContextName),
        url: new FormControl(''),
        needServices: new FormControl(false),
        needHistoricalData: new FormControl(false),
        cygnus: new FormControl(''),
        comet: new FormControl(''),
      }),
      services: [],
      entities: [],
      selectedEntities: [],
    });
  }

  protected onRemoveContextBroker(index: number): void {
    this.contextBrokers.splice(index, 1);
  }

  protected onApplyConfiguration(): void {
    const config: Configuration = {
      contextBrokers: this.getContextBrokers(),
    };
    this.configDashboardService.postConfiguration(config).pipe(takeUntil(this.destroy$)).subscribe({
      error: (err): void => this.messageService.add({ severity: 'error', summary: 'Cannot apply the configuration' }),
    });
  }

  private getContextBrokers(): ContextBroker[] {
    return this.contextBrokers.map(cb => {
      return {
        name: cb.form.get('name').value,
        url: cb.form.get('url').value,
        needServices: cb.form.get('needServices').value,
        needHistoricalData: cb.form.get('needHistoricalData').value,
        cygnus: cb.form.get('cygnus').value,
        comet: cb.form.get('comet').value,
        entities: this.layerService.treeNodesToEntitiesConfiguration(cb.entities, cb.selectedEntities),
        services: this.getServices(cb),
      };
    });
  }

  private getServices(cb: ContextBrokerConfiguration): ContextBrokerService[] {
    return cb.services.map(s => {
      return {
        service: s.form.get('service').value,
        servicePath: s.form.get('servicePath').value,
        entities: this.layerService.treeNodesToEntitiesConfiguration(s.entities, s.selectedEntities),
      };
    });
  }

  private initConfiguration(contextBrokers: ContextBroker[]): void {
    contextBrokers.forEach(cb => {
      const { treeNodes, selectedTreeNodes }: any = this.layerService.entitiesConfigurationToTreeNodes(cb.entities);
      this.contextBrokers.unshift({
        header: cb.name,
        form: new FormGroup({
          name: new FormControl(cb.name),
          url: new FormControl(cb.url),
          needServices: new FormControl(true),
          needHistoricalData: new FormControl(true),
          cygnus: new FormControl(cb.cygnus),
          comet: new FormControl(cb.comet),
        }),
        services: this.initServiceConfiguration(cb),
        entities: treeNodes,
        selectedEntities: selectedTreeNodes,
      });
    });
  }

  private initServiceConfiguration(cb: ContextBroker): ContextBrokerServiceConfiguration[] {
    return cb.services.map(s => {
      const { treeNodes, selectedTreeNodes }: any = this.layerService.entitiesConfigurationToTreeNodes(s.entities);
      return {
        header: s.service + s.servicePath,
        form: new FormGroup({
          service: new FormControl(s.service),
          servicePath: new FormControl(s.servicePath),
        }),
        entities: treeNodes,
        selectedEntities: selectedTreeNodes,
      };
    });
  }

}
