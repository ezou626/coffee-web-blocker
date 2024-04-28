export interface Link {
    id: number;
    url: string;
}

export interface BlockListMetadata {
    id: number;
    name: string;
}

export interface BlockList {
    id: number;
    name: string;
    links: Link[];
}