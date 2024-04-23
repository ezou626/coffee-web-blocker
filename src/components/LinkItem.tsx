import React, { useState } from 'react';

export interface Link {
  id: number;
  url: string;
}

export interface LinkItemProps {
  link: Link;
  onEdit: (newLink: string) => void;
  onDelete: () => void;
}

export const LinkItem: React.FC<LinkItemProps> = ({ link, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedLink] = useState(link.url);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedSnippet);
    setIsEditing(false);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(link.url);
  };

  return (
    <li className="snippet-item">
      {isEditing ? (
        <div>
          <textarea
            value={editedSnippet}
            onChange={(e) => setEditedLink(e.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          <span>{link.url}</span>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleCopyClick}>Copy</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};
