import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-config-dashboard',
  templateUrl: './config-dashboard.component.html',
  styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent implements OnInit {

  protected contextBrokers: any[] = [];
  private defaultContextName: string = 'New Context Broker';

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

}
