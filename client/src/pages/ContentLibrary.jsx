import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent } from "../redux/contentSlice";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const ContentLibrary = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // Helper to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
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
            <h1 className="text-3xl font-bold text-gray-900">Self-Help Content Library</h1>
            <p className="text-gray-600 mt-1">Explore wellness resources and videos.</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading content...</div>}
        {error && <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">Error: {error}</div>}
        {!loading && Array.isArray(items) && items.length === 0 && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No content available.</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(items) &&
            items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                {item.type === "video" ? (
                  getYouTubeId(item.url) ? (
                    <div className="relative pb-[56.25%] h-0 overflow-hidden">
                      <iframe src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full" />
                    </div>
                  ) : (
                    <video className="w-full rounded-t-lg" controls src={item.url} alt={item.title} style={{ maxHeight: "200px", objectFit: "cover" }} />
                  )
                ) : item.type === "image" ? (
                  <img src={item.url} alt={item.title} className="w-full rounded-t-lg" style={{ maxHeight: "200px", objectFit: "cover" }} />
                ) : (
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                )}
                {(item.type === "video" || item.type === "image") && (
                  <div className="p-4">
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                )}
                <div className="p-4">
                  <Link to={`/content/${item._id}`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </Link>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">{item.tags?.length > 0 ? item.tags.join(", ") : "No tags"}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
