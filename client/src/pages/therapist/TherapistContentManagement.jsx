import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContent, fetchContent, editContent, removeContent } from "../../redux/contentSlice";
import { BookOpen, Edit, Trash2, X, ExternalLink } from "lucide-react";

const TherapistContentManagement = () => {
  const dispatch = useDispatch();
  const { items: contentList, loading } = useSelector((state) => state.content);
  const { user } = useSelector((state) => state.auth);

  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    url: "",
    type: "video",
    tags: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState(null);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // Helper to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newContent.title || !newContent.url || !newContent.type) return;

    const contentData = {
      ...newContent,
      tags: newContent.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      uploadedBy: user?.id,
    };

    if (editingId) {
      dispatch(editContent({ id: editingId, updatedData: contentData }));
    } else {
      dispatch(addContent(contentData));
    }

    setNewContent({
      title: "",
      description: "",
      url: "",
      type: "video",
      tags: "",
    });
    setEditingId(null);
  };

  const handleEdit = (content) => {
    setNewContent({
      title: content.title,
      description: content.description,
      url: content.url,
      type: content.type || "video",
      tags: content.tags?.join(", ") || "",
    });
    setEditingId(content._id);
  };

  const handleDelete = (id) => {
    setDeleteContentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteContentId) {
      dispatch(removeContent(deleteContentId));
    }
    setShowDeleteModal(false);
    setDeleteContentId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteContentId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Your Content</h1>
            <p className="text-gray-600 mt-1">Create and edit your self-help resources.</p>
          </div>
        </div>
      </div>

      {/* Content Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{editingId ? "Edit Content" : "Add New Content"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-900 font-semibold mb-2">
              Title
            </label>
            <input id="title" type="text" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Title" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-900 font-semibold mb-2">
              Content Type
            </label>
            <select id="type" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={newContent.type} onChange={(e) => setNewContent({ ...newContent, type: e.target.value })} required>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="exercise">Exercise</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-900 font-semibold mb-2">
              Tags (comma-separated)
            </label>
            <input id="tags" type="text" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Tags (comma-separated)" value={newContent.tags} onChange={(e) => setNewContent({ ...newContent, tags: e.target.value })} />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-900 font-semibold mb-2">
              Description
            </label>
            <textarea id="description" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Description" rows="3" value={newContent.description} onChange={(e) => setNewContent({ ...newContent, description: e.target.value })} />
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="block text-gray-900 font-semibold mb-2">
              Content URL
            </label>
            <input id="url" type="url" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Content URL" value={newContent.url} onChange={(e) => setNewContent({ ...newContent, url: e.target.value })} required />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setNewContent({
                    title: "",
                    description: "",
                    url: "",
                    type: "video",
                    tags: "",
                  });
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Content</h2>
        {loading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading content...</div>
        ) : contentList.filter((c) => c.uploadedBy === user?.id).length === 0 ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No content uploaded by you yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contentList
              .filter((c) => c.uploadedBy === user?.id)
              .map((c) => (
                <div key={c._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                  {c.type === "video" && c.url.includes("youtube.com") ? (
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <iframe src={`https://www.youtube.com/embed/${getYouTubeId(c.url)}`} title={c.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full" />
                    </div>
                  ) : (
                    <div className="p-4">
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Content
                      </a>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
                    <p className="text-gray-600 text-sm">
                      <strong>Type:</strong> {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                      <br />
                      <strong>Description:</strong> {c.description || "No description"}
                      <br />
                      <strong>Tags:</strong> {c.tags?.join(", ") || "No tags"}
                    </p>
                  </div>
                  <div className="p-4 border-t border-gray-200 flex justify-between">
                    <button className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors" onClick={() => handleEdit(c)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" onClick={() => handleDelete(c._id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={cancelDelete} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this content?</p>
            <div className="flex justify-end space-x-2">
              <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistContentManagement;
