import { Component, OnInit, OnChanges, AfterViewChecked, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { MessageService } from 'primeng/api';
import { AccordionTab, Accordion } from 'primeng/accordion/accordion';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent implements OnInit {

  protected contextBrokers: any[] = [];
  protected services: any[] = [];
  protected blocked: boolean;
  private defaultContextName: string = 'New Context Broker';
  private defaultServiceName: string = 'New Service';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) { }

  public ngOnInit(): void {
  }

  protected onAddContextBroker(): void {

    this.contextBrokers.unshift({
      header: this.defaultContextName,
      form: new FormGroup({
        name: new FormControl(this.defaultContextName),
        url: new FormControl(),
        port: new FormControl(),
      }),
      services: [],
    });

  }

  protected onAddService(): void {

    this.services.unshift({
      header: this.defaultServiceName,
      form: new FormGroup({
        service: new FormControl(),
        servicePath: new FormControl(),
      }),
      services: [],
    });

  }

  protected onGeneralConfigChange(index: number): void {
    const name: string = this.contextBrokers[index].form.value.name;
    const url: string = this.contextBrokers[index].form.value.url;
    const port: string = this.contextBrokers[index].form.value.port;

    this.contextBrokers[index].header = name + (name && url ? ' - ' + url : '') + (name && url && port ? ':' + port : '');
  }

  protected onServiceConfigChange(index: number): void {
    const service: string = this.services[index].form.value.service;
    const servicePath: string = this.services[index].form.value.servicePath;

    this.services[index].header = service + (service && servicePath ? servicePath : '');
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

  protected onGetEntities(index: number): void {
    this.blocked = true;
    const url: string = this.contextBrokers[index].form.value.url;
    const port: string = this.contextBrokers[index].form.value.port;
    const service: string = this.services[index].form.value.service;
    const servicePath: string = this.services[index].form.value.servicePath;

    this.configDashboardService.getEntitiesFromService(url, port, service, servicePath).subscribe(res => {
      this.blocked = false;
      if (res.statusCode === 200) {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Found entities!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Cannot find entities' });
      }
    }, err => {
      this.blocked = false;
      this.messageService.add({ severity: 'error', summary: 'Cannot find entities' });
    });
  }

  protected onRemoveContextBroker(index: number): void {
    this.contextBrokers.splice(index, 1);
  }

}
