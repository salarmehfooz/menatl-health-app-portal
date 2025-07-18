import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../redux/contentSlice";

const ContentLibrary = () => {
  const dispatch = useDispatch();
  const { contentList, loading, error } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2>Self-Help Content Library</h2>

      {loading && <p>Loading content...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <div className="row mt-3">
        {Array.isArray(contentList) && contentList.length > 0
          ? contentList.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <div className="card h-100 shadow-sm">
                  {item.type === "video" ? (
                    <iframe
                      className="card-img-top"
                      src={item.url}
                      title={item.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  ) : item.type === "image" ? (
                    <img
                      src={item.url}
                      className="card-img-top"
                      alt={item.title}
                    />
                  ) : (
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.description}</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-primary"
                      >
                        Read More
                      </a>
                    </div>
                  )}
                  {item.type !== "article" && (
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.description}</p>
                    </div>
                  )}
                  <div className="card-footer">
                    <small className="text-muted">
                      {item.tags?.join(", ")}
                    </small>
                  </div>
                </div>
              </div>
            ))
          : !loading && <p>No content available.</p>}
      </div>
    </div>
  );
};

export default ContentLibrary;
