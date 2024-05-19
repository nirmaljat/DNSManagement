import React, { useState } from "react";


const DNSItem = ({
  name,
  type,
  value,
  updateHandler,
  deleteHandler,
  id,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedType, setEditedType] = useState(type);
  const [editedValue, setEditedValue] = useState(value);

  const handleUpdate = () => {
    updateHandler(id, editedName, editedType, editedValue);
    setIsEditing(false);
  };

  return (
    <div className="dns-item">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <input
            type="text"
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
          />
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
          />
        </div>
      ) : (
        <div className="display-mode">
          <h4>{name}</h4>
          <p>{type}</p>
          <p>{value}</p>
        </div>
      )}
      <div className="actions">
        {isEditing ? (
          <button onClick={handleUpdate} className="btn save-btn">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn edit-btn">
            Edit
          </button>
        )}
        <button onClick={() => deleteHandler(id)} className="btn delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default DNSItem;
