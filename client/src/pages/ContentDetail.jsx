import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ContentDetail = () => {
  const { id } = useParams();
  const contentItem = useSelector((state) =>
    state.content.items.find((item) => item._id === id)
  );

  if (!contentItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        <p>Content not found.</p>
      </div>
    );
  }

  const getYouTubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {contentItem.title}
      </h2>

      {contentItem.type === "video" ? (
        getYouTubeId(contentItem.url) ? (
          <div
            className="relative w-full pb-[56.25%] mb-6"
            style={{ height: 0, overflow: "hidden" }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(
                contentItem.url
              )}`}
              title={contentItem.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            />
          </div>
        ) : (
          <video
            controls
            src={contentItem.url}
            className="w-full rounded-lg shadow-md mb-6"
          />
        )
      ) : contentItem.type === "image" ? (
        <img
          src={contentItem.url}
          alt={contentItem.title}
          className="w-full rounded-lg shadow-md mb-6"
        />
      ) : null}

      {/* Description below video/image */}
      {contentItem.description && (
        <p className="text-gray-700 mb-6 leading-relaxed">
          {contentItem.description}
        </p>
      )}

      <p className="mb-6 text-gray-600">
        <strong className="font-semibold">Tags:</strong>{" "}
        {contentItem.tags && contentItem.tags.length > 0
          ? contentItem.tags.join(", ")
          : "No tags"}
      </p>

      <a
        href={contentItem.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Open Original Content
      </a>
    </div>
  );
};

export default ContentDetail;
