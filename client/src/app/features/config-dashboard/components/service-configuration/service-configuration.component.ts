import { Component, OnInit, Input } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { MessageService, TreeNode } from 'primeng/api';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { LayerService } from 'src/app/features/map-dashboard/services/layer-service/layer-service';

@Component({
  selector: 'app-service-configuration',
  templateUrl: './service-configuration.component.html',
  styleUrls: ['./service-configuration.component.scss'],
})
export class ServiceConfigurationComponent extends BaseComponent {

  @Input() public cb: any;
  private defaultServiceName: string = 'New Service';
  private defaultService: string = 'environment';
  private defaultServicePath: string = '/Madrid';

  constructor(
    private configDashboardService: ConfigDashboardService,
    private messageService: MessageService,
    private layerService: LayerService,
  ) {
    super();
  }

  protected onAddService(): void {
    this.cb.services.unshift({
      header: this.defaultService + ' - ' + this.defaultServicePath,
      form: new FormGroup({
        service: new FormControl(this.defaultService),
        servicePath: new FormControl(this.defaultServicePath),
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

  protected onGetEntities(index: number): void {
    const url: string = this.cb.form.value.url;
    const port: string = this.cb.form.value.port;
    const service: string = this.cb.services[index].form.value.service;
    const servicePath: string = this.cb.services[index].form.value.servicePath;

    this.configDashboardService.getEntitiesFromService(url, service, servicePath).pipe(takeUntil(this.destroy$)).subscribe(res => {
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
    this.cb.services[index].entities = this.layerService.getEntities(entities);
    this.cb.services[index].selectedEntities = this.layerService.getAllLayers(this.cb.services[index].entities);
  }

  private onGetEntitiesFail(): void {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Cannot find entities' });
  }

}
