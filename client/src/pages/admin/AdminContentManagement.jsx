import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent, removeContent } from "../../redux/contentSlice";

const AdminContentManagement = () => {
  const dispatch = useDispatch();
  const { contentList, loading } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      dispatch(removeContent(id));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Content</h2>
      {loading ? (
        <p>Loading content...</p>
      ) : (
        <div className="row">
          {contentList.map((c) => (
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
                  <button
                    className="btn btn-sm btn-outline-danger d-block"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {contentList.length === 0 && (
            <p className="text-center">No content available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContentManagement;
