type IdeaFormProps = {
  title: string;
  description: string;
  category: string;

  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setCategory: (value: string) => void;

  onPublish: () => void;
};

function IdeaForm({
  title,
  description,
  category,
  setTitle,
  setDescription,
  setCategory,
  onPublish,
}: IdeaFormProps) {
  return (
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

      <button onClick={onPublish}>
        Publish Idea
      </button>
    </div>
  );
}

export default IdeaForm;