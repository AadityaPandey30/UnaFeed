"use client";
import { useEffect, useState } from "react";
import { listPosts } from "../../../lip/api";

const AnnouncementSection = () => {
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

  const announcements = posts.filter((p) => p.type === "announcement");

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Official Announcements</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {announcements.length === 0 && (
            <p className="text-gray-500">No announcements available.</p>
          )}
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-semibold text-blue-800">
                {a.title || "Announcement"}
              </h3>
              <p className="text-gray-700 mt-1">{a.content}</p>
              <p className="text-xs text-gray-500 mt-2">By {a.author}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AnnouncementSection;
