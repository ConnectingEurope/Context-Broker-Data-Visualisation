import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TreeNode } from 'primeng/api/treenode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  protected menuItems: MenuItem[];
  protected layers: TreeNode[];
  protected selectedLayers: TreeNode[];

  private map: L.Map;

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    this.menuItems = [
      { label: 'Map', icon: 'pi pi-map-marker' },
      { label: 'Graphs', icon: 'pi pi-desktop' }
    ];
  }

}
