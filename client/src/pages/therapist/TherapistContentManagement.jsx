import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContent,
  fetchContent,
  editContent,
  removeContent,
} from "../../redux/contentSlice";

const TherapistContentManagement = () => {
  const dispatch = useDispatch();

  // Fix here: use items from state.content as contentList
  const { items: contentList, loading } = useSelector((state) => state.content);

  const { user } = useSelector((state) => state.auth);

  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    url: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newContent.title || !newContent.url) return;

    const contentData = {
      ...newContent,
      therapistId: user?._id,
    };

    if (editingId) {
      // Fix here: use updatedData (not updatedContent) as per your slice thunk definition
      dispatch(editContent({ id: editingId, updatedData: contentData }));
    } else {
      dispatch(addContent(contentData));
    }

    setNewContent({ title: "", description: "", url: "" });
    setEditingId(null);
  };

  const handleEdit = (content) => {
    setNewContent({
      title: content.title,
      description: content.description,
      url: content.url,
    });
    setEditingId(content._id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      dispatch(removeContent(id));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Your Content</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-4 border p-3 rounded shadow-sm"
      >
        <h5>{editingId ? "Edit Content" : "Add New Content"}</h5>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={newContent.title}
            onChange={(e) =>
              setNewContent({ ...newContent, title: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Description"
            rows="2"
            value={newContent.description}
            onChange={(e) =>
              setNewContent({ ...newContent, description: e.target.value })
            }
          />
        </div>
        <div className="mb-2">
          <input
            type="url"
            className="form-control"
            placeholder="Content URL"
            value={newContent.url}
            onChange={(e) =>
              setNewContent({ ...newContent, url: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {editingId ? "Update" : "Create"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setNewContent({ title: "", description: "", url: "" });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading content...</p>
      ) : (
        <div className="row">
          {contentList
            .filter((c) => c.therapistId === user?._id)
            .map((c) => (
              <div className="col-md-4 mb-4" key={c._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{c.title}</h5>
                    <p className="card-text">{c.description}</p>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary mb-2"
                    >
                      View Content
                    </a>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {contentList.filter((c) => c.therapistId === user?._id).length ===
            0 && <p className="text-center">No content uploaded by you yet.</p>}
        </div>
      )}
    </div>
  );
};

export default TherapistContentManagement;
