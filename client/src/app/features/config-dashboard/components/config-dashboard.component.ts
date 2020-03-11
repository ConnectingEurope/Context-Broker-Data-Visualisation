import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent implements OnInit {

  protected contextBrokers: any[] = [];
  protected blocked: boolean;
  private defaultContextName: string = 'New Context Broker';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) { }

  public ngOnInit(): void {
  }

  protected onAddContextBroker(): void {
    this.contextBrokers.push({
      header: this.defaultContextName,
      name: this.defaultContextName,
      form: new FormGroup({
        name: new FormControl(this.defaultContextName),
        url: new FormControl(),
        port: new FormControl(),
      }),
    });
  }

  protected onGeneralConfigChange(index: number): void {
    const name: string = this.contextBrokers[index].form.value.name;
    const url: string = this.contextBrokers[index].form.value.url;
    const port: string = this.contextBrokers[index].form.value.port;

    this.contextBrokers[index].header = name + (name && url ? ' - ' + url : '') + (name && url && port ? ':' + port : '');
  }

  protected onCheckContextBroker(index: number): void {
    this.blocked = true;
    const url: string = this.contextBrokers[index].form.value.url;
    const port: string = this.contextBrokers[index].form.value.port;

    this.configDashboardService.checkContextBrokerHealth(url, port).subscribe(res => {
      this.blocked = false;
      if (res.statusCode === 200) {
        this.messageService.add({ severity: 'success', summary: 'Context Broker is live!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Cannot find the Context Broker' });
      }
    }, err => {
      this.blocked = false;
      this.messageService.add({ severity: 'error', summary: 'Cannot find the Context Broker' });
    });
  }

}
