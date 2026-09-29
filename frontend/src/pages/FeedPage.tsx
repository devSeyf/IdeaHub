import { useEffect, useState } from "react";
import type { Idea } from "../types/Idea";
import type { Comment } from "../types/Comment";

function FeedPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const [commentContent, setCommentContent] = useState("");

  async function getIdeas() {
    const token = localStorage.getItem("token");

    const response = await fetch("https://localhost:7134/api/ideas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    setIdeas(data);
  }

  useEffect(() => {
    getIdeas();
  }, []);

  async function toggleLike(idea: Idea) {
    const token = localStorage.getItem("token");

    const method = idea.isLikedByCurrentUser ? "DELETE" : "POST";

    const response = await fetch(
      `https://localhost:7134/api/likes/${idea.id}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      getIdeas();
    }
  }

  async function createIdea() {
    const token = localStorage.getItem("token");

    const response = await fetch("https://localhost:7134/api/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        category,
      }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setCategory("");

      getIdeas();
    }
  }

  async function getComments(ideaId: string) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://localhost:7134/api/comments/idea/${ideaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    setComments(data);
    setSelectedIdeaId(ideaId);
  }

  async function createComment(ideaId: string) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://localhost:7134/api/comments/idea/${ideaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: commentContent,
        }),
      },
    );

    if (response.ok) {
      setCommentContent("");
      getComments(ideaId);
      getIdeas();
    }
  }

  async function deleteComment(commentId: string, ideaId: string) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://localhost:7134/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      getComments(ideaId);
      getIdeas();
    }
  }









  const currentUserId = localStorage.getItem("userId");










async function deleteIdea(ideaId: string) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://localhost:7134/api/ideas/${ideaId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    getIdeas();
  }
}

  return (
    <div>
      <h1>IdeaHub Feed</h1>

      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={createIdea}>Publish Idea</button>
      </div>
      {ideas.map((idea) => (
        <div key={idea.id}>
          <h3>{idea.title}</h3>
          <p>{idea.description}</p>
          <p>{idea.category}</p>
          <p>By: {idea.userName}</p>
          <p>Likes: {idea.likesCount}</p>
          <p>Comments: {idea.commentsCount}</p>

          <button onClick={() => toggleLike(idea)}>
            {idea.isLikedByCurrentUser ? "Unlike" : "Like"}
          </button>

          <button onClick={() => getComments(idea.id)}>
            Comments ({idea.commentsCount})
          </button>
        {idea.userId === currentUserId && (
  <button onClick={() => deleteIdea(idea.id)}>
    Delete Idea
  </button>
)}

          {selectedIdeaId === idea.id && (
            <div>
              {comments.map((comment) => (
                <div key={comment.id}>
                  <strong>{comment.userName}</strong>
                  <p>{comment.content}</p>

                  {comment.userId === currentUserId && (
                    <button onClick={() => deleteComment(comment.id, idea.id)}>
                      Delete
                    </button>
                  )}
                </div>
              ))}

              <input
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />

              <button onClick={() => createComment(idea.id)}>
                Add Comment
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FeedPage;
