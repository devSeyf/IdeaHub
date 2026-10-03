import { useEffect, useState } from "react";
import type { Idea } from "../types/Idea";
import type { Comment } from "../types/Comment";
import IdeaForm from "../components/IdeaForm";
import IdeaCard from "../components/IdeaCard";
import api from "../services/api";

function FeedPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const [commentContent, setCommentContent] = useState("");

  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

 

async function getIdeas() {
  const response = await api.get<Idea[]>("/ideas");

  setIdeas(response.data);
}






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


  async function updateIdea(
    ideaId: string,
    title: string,
    description: string,
    category: string
  ) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://localhost:7134/api/ideas/${ideaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      }
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

    const response = await fetch(`https://localhost:7134/api/ideas/${ideaId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      getIdeas();
    }
  }
  function startEditing(idea: Idea) {
    setEditingIdeaId(idea.id);
    setEditTitle(idea.title);
    setEditDescription(idea.description);
    setEditCategory(idea.category);
  }
  return (
    <div>
      <h1>IdeaHub Feed</h1>

      <div>
        <IdeaForm
          title={title}
          description={description}
          category={category}
          setTitle={setTitle}
          setDescription={setDescription}
          setCategory={setCategory}
          onPublish={createIdea}
        />
      </div>
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onToggleLike={toggleLike}
          onDelete={deleteIdea}
          onUpdate={updateIdea}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

export default FeedPage;
