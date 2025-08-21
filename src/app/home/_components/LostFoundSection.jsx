"use client";
import { useEffect, useState } from "react";
import { listPosts } from "../../../lip/api"; // keep this simple API function

const LostFoundSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await listPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const lost = posts.filter((p) => p.type === "lostfound");

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Lost & Found</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lost.length === 0 && (
            <p className="text-gray-500">No lost & found items yet.</p>
          )}
          {lost.map((item) => (
            <div
              key={item.id}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-bold text-yellow-800">
                {item.title || "Lost Item"}
              </h3>
              <p className="text-gray-700 mt-1">{item.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted by {item.author}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LostFoundSection;
