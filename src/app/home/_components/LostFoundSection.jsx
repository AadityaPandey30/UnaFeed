// "use client";
// import { useEffect, useState } from "react";
// import { listPosts } from "../../../lip/api"; // keep this simple API function

// const LostFoundSection = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const data = await listPosts();
//         setPosts(data);
//       } catch (error) {
//         console.error("Failed to fetch posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const lost = posts.filter((p) => p.type === "lostfound");

//   return (
//     <section>
//       <h2 className="text-xl font-semibold mb-3">Lost & Found</h2>

//       {loading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {lost.length === 0 && (
//             <p className="text-gray-500">No lost & found items yet.</p>
//           )}
//           {lost.map((item) => (
//             <div
//               key={item.id}
//               className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm"
//             >
//               <h3 className="font-bold text-yellow-800">
//                 {item.title || "Lost Item"}
//               </h3>
//               <p className="text-gray-700 mt-1">{item.content}</p>
//               <p className="text-xs text-gray-500 mt-2">
//                 Posted by {item.author}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default LostFoundSection;


"use client";
import { useEffect, useState } from "react";
import { listPosts } from "../../../lip/api"; // simple API fetcher

const LostFoundSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState({}); // store likes & comments count

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await listPosts();
        // initialize reaction state
        const initialReactions = {};
        data.forEach((p) => {
          initialReactions[p.id] = { likes: 0, comments: [] };
        });
        setReactions(initialReactions);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const lostfound = posts.filter((p) => p.type === "lostfound");

  const handleLike = (id) => {
    setReactions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        likes: prev[id].likes + 1,
      },
    }));
  };

  const handleComment = (id, text) => {
    if (!text.trim()) return;
    setReactions((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        comments: [...prev[id].comments, text],
      },
    }));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Lost & Found</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lostfound.length === 0 && (
            <p className="text-gray-500">No lost & found items yet.</p>
          )}

          {lostfound.map((item) => {
            const reactData = reactions[item.id] || { likes: 0, comments: [] };
            return (
              <div
                key={item.id}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-yellow-800">
                  {item.itemName || "Lost Item"}{" "}
                  <span className="text-xs text-gray-500">
                    ({item.mode === "lost" ? "Lost" : "Found"})
                  </span>
                </h3>

                {item.lastSeenLocation && (
                  <p className="text-xs text-gray-500">
                    📍 Last seen at {item.lastSeenLocation}
                  </p>
                )}

                {item.lastSeenAt && (
                  <p className="text-xs text-gray-500">
                    🗓 {new Date(item.lastSeenAt).toLocaleString()}
                  </p>
                )}

                <p className="text-gray-700 mt-2">{item.content}</p>

                {item.contactHint && (
                  <p className="text-xs text-gray-600 mt-1">
                    📞 Contact: {item.contactHint}
                  </p>
                )}

                {item.resolved && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ Resolved on{" "}
                    {item.resolvedAt
                      ? new Date(item.resolvedAt).toLocaleDateString()
                      : ""}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Posted by {item.author}
                </p>

                {/* --- Reactions --- */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => handleLike(item.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    👍 {reactData.likes}
                  </button>
                  <span className="text-sm text-gray-600">
                    💬 {reactData.comments.length}
                  </span>
                </div>

                {/* --- Comment input --- */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full border rounded p-1 text-sm text-black"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment(item.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  {reactData.comments.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {reactData.comments.map((c, idx) => (
                        <li key={idx} className="border-t pt-1">
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default LostFoundSection;
