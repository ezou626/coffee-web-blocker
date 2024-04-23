import React from 'react';
import { Link, LinkItem } from './LinkItem';

export type { Link } from './LinkItem';

export interface BlockListProps {
  links: Link[];
  onEditLink: (id: number, newLink: string) => void;
  onDeleteLink: (id: number) => void;
}

export const BlockList: React.FC<BlockListProps> = ({
  links,
  onEditLink,
  onDeleteLink,
}) => {
  return (
    <ul className="snippet-list">
      {links.map((link: Link) => (
        <LinkItem
          key={link.id}
          link={link}
          onEdit={(newLink) => onEditLink(link.id, newLink)}
          onDelete={() => onDeleteLink(link.id)}
        />
      ))}
    </ul>
  );
};

export default BlockList;