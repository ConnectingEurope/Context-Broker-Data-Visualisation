import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent extends BaseComponent {

  protected contextBrokers: any[] = [];
  private defaultContextName: string = 'Madrid Air';
  private defaultUrl: string = 'https://streams.lab.fiware.org';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) {
    super();
  }

  protected onAddContextBroker(): void {
    this.contextBrokers.unshift({
      header: this.defaultContextName + ' - ' + this.defaultUrl,
      form: new FormGroup({
        name: new FormControl(this.defaultContextName),
        url: new FormControl('https://streams.lab.fiware.org'),
        port: new FormControl(''),
      }),
      services: [],
    });
  }

  protected onRemoveContextBroker(index: number): void {
    this.contextBrokers.splice(index, 1);
  }

  protected onApplyConfiguration(): void {
    const config: any = {
      contextBrokers: this.getContextBrokers(),
    };
    this.configDashboardService.postConfiguration(config).pipe(takeUntil(this.destroy$)).subscribe({
      error: (err): void => this.messageService.add({ severity: 'error', summary: 'Cannot configure' }),
    });
  }

  private getContextBrokers(): any[] {
    return this.contextBrokers.map(cb => {
      return {
        url: cb.form.get('url').value,
        port: cb.form.get('port').value,
        services: this.getServices(cb),
      };
    });
  }

  private getServices(cb: any): any[] {
    return cb.services.map(s => {
      return {
        service: s.form.get('service').value,
        servicePath: s.form.get('servicePath').value,
        entities: this.getEntities(s),
      };
    });
  }

  private getEntities(s: any): any[] {
    const entities: any = {};

    s.selectedEntities.forEach(e => {
      if (e.parent) {
        if (entities[e.parent.data] === undefined) { entities[e.parent.data] = []; }
        entities[e.parent.data].push(e.data);
      }
    });

    return this.parseEntities(entities);
  }

  private parseEntities(entities: any): any[] {
    return Object.entries(entities).map(([key, value]) => {
      return { type: key, attrs: value };
    });
  }

}
