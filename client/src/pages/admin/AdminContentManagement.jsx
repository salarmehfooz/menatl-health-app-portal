import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent, removeContent } from "../../redux/contentSlice";
import { Link } from "react-router-dom";
import { BookOpen, Eye, Trash2, Video, Image, Play } from "lucide-react";

const AdminContentManagement = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      dispatch(removeContent(id));
    }
  };

  // Helper to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
              <div className="relative p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Manage Content</h1>
              <p className="text-gray-600 mt-2 text-lg">Edit and organize wellness resources.</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-700 font-medium">Loading content...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
            <div className="text-center">
              <span className="text-red-700 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {!loading && Array.isArray(items) && items.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content available.</h3>
              <p className="text-gray-500">Start exploring wellness resources.</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!loading && Array.isArray(items) && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item._id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1">
                {/* Media Preview */}
                <div className="relative overflow-hidden">
                  {item.type === "video" ? (
                    getYouTubeId(item.url) ? (
                      <div className="relative">
                        <div className="aspect-video bg-gray-100">
                          <iframe src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Video className="h-3 w-3 mr-1" />
                            YouTube
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-gray-100">
                        <video className="w-full h-full object-cover" controls src={item.url} alt={item.title} />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </span>
                        </div>
                      </div>
                    )
                  ) : item.type === "image" ? (
                    <div className="relative aspect-video bg-gray-100">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Image className="h-3 w-3 mr-1" />
                          Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Content Preview</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h5 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.title}</h5>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link to={`/content/${item._id}`} className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                      View Details
                    </Link>
                    <button onClick={() => handleDelete(item._id)} className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="p-6 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">{item.tags?.length > 0 ? item.tags.join(", ") : "No tags"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContentManagement;
