import { TreeNode } from 'primeng/api/treenode';

export class LayerUtils {

    static readonly PARKING: TreeNode = { data: 'parking', label: 'Parkings' };
    static readonly BIKE_STATION: TreeNode = { data: 'bikeStation', label: 'Bike stations' };
    static readonly BUS: TreeNode = { data: 'bus', label: 'Buses' };
    static readonly TRANSPORT: TreeNode = {
        data: 'transport',
        label: 'Transport',
        children: [
            LayerUtils.PARKING,
            LayerUtils.BIKE_STATION,
            LayerUtils.BUS
        ]
    };
    static readonly MAIN_LAYERS: TreeNode[] = [LayerUtils.TRANSPORT];
    static readonly ALL_LAYERS: TreeNode[] = [
        LayerUtils.PARKING,
        LayerUtils.BIKE_STATION,
        LayerUtils.BUS,
        LayerUtils.TRANSPORT
    ];

}
