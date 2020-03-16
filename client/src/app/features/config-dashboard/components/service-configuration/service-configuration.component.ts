import { Component, OnInit, Input } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { MessageService, TreeNode } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';

@Component({
  selector: 'app-service-configuration',
  templateUrl: './service-configuration.component.html',
  styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent {

  @Input() public cb: any;
  private defaultServiceName: string = 'New Service';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
  ) {
    super();
  }

  protected onAddService(): void {
    this.cb.services.unshift({
      header: this.defaultServiceName,
      form: new FormGroup({
        service: new FormControl('openiot'),
        servicePath: new FormControl('/AirQualityObserved'),
      }),
      entities: [],
      selectedEntities: [],
    });
  }

  protected onServiceConfigChange(index: number): void {
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;

    this.cb.services[index].header = service + (service && servicePath ? servicePath : '');
  }

  protected onGetEntities(index: number): void {
    const url: string = this.cb.form.value.url;
    const port: string = this.cb.form.value.port;
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;

    this.configDashboardService.getEntitiesFromService(url, port, service, servicePath).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res.statusCode === 200 && res.body && res.body.length > 0) {
        this.onGetEntitiesSuccess(res.body, index);
      } else {
        this.onGetEntitiesFail();
      }
    }, err => {
      this.onGetEntitiesFail();
    });
  }

  private onGetEntitiesSuccess(entities: any[], index: number): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Found entities!' });
    this.showEntities(entities, index);
  }

  private onGetEntitiesFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Cannot find entities' });
  }

  private showEntities(entities: any[], index: number) {
    const entitiesTree: TreeNode[] = [];
    const selectedEntitiesTree: TreeNode[] = [];

    entities.forEach(e => {
      entitiesTree.push({
        data: e.type,
        label: e.type,
        children: Object.keys(e.attrs).map((a: string) => ({ data: a, label: a } as TreeNode)),
      });
      selectedEntitiesTree.push({
        data: e.type,
        label: e.type,
      });
      selectedEntitiesTree.concat(Object.keys(e.attrs).map((a: string) => ({ data: a, label: a })));
    });
    console.log(entitiesTree);
    this.cb.services[index].entities = entitiesTree;
    this.cb.services[index].selectedEntities = selectedEntitiesTree;
  }

}
