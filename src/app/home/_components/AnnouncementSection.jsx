// "use client";
// import { useEffect, useState } from "react";
// import { listPosts } from "../../../lip/api";

// const AnnouncementSection = () => {
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

//   const announcements = posts.filter((p) => p.type === "announcement");

//   return (
//     <section>
//       <h2 className="text-xl font-semibold mb-3">Official Announcements</h2>

//       {loading ? (
//         <p className="text-gray-500">Loading...</p>
//       ) : (
//         <div className="space-y-3">
//           {announcements.length === 0 && (
//             <p className="text-gray-500">No announcements available.</p>
//           )}
//           {announcements.map((a) => (
//             <div
//               key={a.id}
//               className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm"
//             >
//               <h3 className="font-semibold text-blue-800">
//                 {a.title || "Announcement"}
//               </h3>
//               <p className="text-gray-700 mt-1">{a.content}</p>
//               <p className="text-xs text-gray-500 mt-2">By {a.author}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default AnnouncementSection;


"use client";
import { useEffect, useState } from "react";

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState({}); // likes + comments state

  useEffect(() => {
    // Dummy data for now
    const dummyAnnouncements = [
      {
        id: 1,
        type: "announcement",
        title: "Exam Schedule Released",
        content:
          "The final exam schedule for Semester 2 has been released. Please check the PDF for details.",
        author: "Examination Cell",
        department: "Academic Affairs",
        attachments: [
          { name: "ExamSchedule.pdf", url: "/dummy/ExamSchedule.pdf" },
        ],
        externalLink: "https://university.edu/exams",
      },
      {
        id: 2,
        type: "announcement",
        title: "Holiday Notice",
        content:
          "The university will remain closed on 25th December for Christmas.",
        author: "Admin Office",
        department: "Administration",
        attachments: [],
        externalLink: "",
      },
    ];

    // initialize reactions
    const initialReactions = {};
    dummyAnnouncements.forEach((a) => {
      initialReactions[a.id] = { likes: 0, comments: [] };
    });

    setAnnouncements(dummyAnnouncements);
    setReactions(initialReactions);
    setLoading(false);
  }, []);

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
      <h2 className="text-xl font-semibold mb-3">Official Announcements</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {announcements.length === 0 && (
            <p className="text-gray-500">No announcements available.</p>
          )}

          {announcements.map((a) => {
            const reactData = reactions[a.id] || { likes: 0, comments: [] };

            return (
              <div
                key={a.id}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-semibold text-blue-800">
                  {a.title || "Announcement"}
                </h3>

                <p className="text-gray-700 mt-1">{a.content}</p>

                <p className="text-xs text-gray-500 mt-2">
                  Department: {a.department || "General"}
                </p>

                {a.attachments && a.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600 font-medium">
                      📎 Attachments:
                    </p>
                    {a.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline block"
                      >
                        {file.name || `Attachment ${idx + 1}`}
                      </a>
                    ))}
                  </div>
                )}

                {a.externalLink && (
                  <p className="mt-2">
                    🔗{" "}
                    <a
                      href={a.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      External Link
                    </a>
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">By {a.author}</p>

                {/* --- Reactions --- */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => handleLike(a.id)}
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
                        handleComment(a.id, e.target.value);
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

export default AnnouncementSection;
