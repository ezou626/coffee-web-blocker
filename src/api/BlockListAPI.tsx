export interface Link {
    id: number;
    url: string;
}

export interface LinkResult { //should become the new link type
  id: number;
  blockListId: number;
  url: string;
}

export interface BlockListMetadata {
    id: number;
    name: string;
}

export interface BlockList extends BlockListMetadata {
    links: Link[];
}