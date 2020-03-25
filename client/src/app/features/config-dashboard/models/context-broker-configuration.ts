export interface EntityConfiguration {
    name: string;
    selected: boolean;
    attrs: {
        name: string;
        selected: boolean;
    }[];
}

export interface ServiceConfiguration {
    service: string;
    servicePath: string;
    entities: EntityConfiguration[];
}

export interface ContextBrokerConfiguration {
    name: string;
    url: string;
    cygnus: string;
    comet: string;
    entities: EntityConfiguration[];
    services: ServiceConfiguration[];
}
