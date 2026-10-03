import { useState } from "react";
import type { Idea } from "../types/Idea";

type IdeaCardProps = {
  idea: Idea;
  onToggleLike: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
  currentUserId: string | null;

  onUpdate: (
    ideaId: string,
    title: string,
    description: string,
    category: string
  ) => void;
};

function IdeaCard({
  idea,
  onToggleLike,
  onDelete,
  currentUserId,
  onUpdate,
}: IdeaCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(idea.title);
  const [editDescription, setEditDescription] = useState(idea.description);
  const [editCategory, setEditCategory] = useState(idea.category);

  return (
    <div>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <p>{idea.category}</p>

      <p>By: {idea.userName}</p>
      <p>Likes: {idea.likesCount}</p>
      <p>Comments: {idea.commentsCount}</p>

      <button onClick={() => onToggleLike(idea)}>
        {idea.isLikedByCurrentUser ? "Unlike" : "Like"}
      </button>

      {idea.userId === currentUserId && (
        <>
          <button onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button onClick={() => onDelete(idea.id)}>
            Delete Idea
          </button>
        </>
      )}

      {isEditing && (
        <div>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <input
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          />

          <button
            onClick={() => {
              onUpdate(
                idea.id,
                editTitle,
                editDescription,
                editCategory
              );

              setIsEditing(false);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default IdeaCard;