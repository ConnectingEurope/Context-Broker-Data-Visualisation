import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ContextBrokerConfiguration, ContextBrokerServiceConfiguration } from '../models/context-broker-configuration';
import { ContextBroker, ContextBrokerService, ContextBrokerEntity, Configuration } from '../models/context-broker';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent extends BaseComponent {

  protected contextBrokers: ContextBrokerConfiguration[] = [];
  private defaultContextName: string = 'New Context Broker';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) {
    super();
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
        url: cb.form.get('url').value,
        cygnus: cb.form.get('cygnus').value,
        comet: cb.form.get('comet').value,
        services: this.getServices(cb),
      };
    });
  }

  private getServices(cb: ContextBrokerConfiguration): ContextBrokerService[] {
    return cb.services.map(s => {
      return {
        service: s.form.get('service').value,
        servicePath: s.form.get('servicePath').value,
        entities: this.getEntities(s),
      };
    });
  }

  private getEntities(s: ContextBrokerServiceConfiguration): ContextBrokerEntity[] {
    const entities: { [key: string]: string[] } = {};

    s.selectedEntities.forEach(e => {
      if (e.parent) {
        if (entities[e.parent.data] === undefined) { entities[e.parent.data] = []; }
        entities[e.parent.data].push(e.data);
      }
    });

    return this.parseEntities(entities);
  }

  private parseEntities(entities: { [key: string]: string[] }): ContextBrokerEntity[] {
    return Object.entries(entities).map(([key, value]) => {
      return { type: key, attrs: value };
    });
  }

}
