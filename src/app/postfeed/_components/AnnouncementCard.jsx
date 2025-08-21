import { useState } from "react";
import { FileText, Save, Edit2 } from "lucide-react";

const AnnouncementCard = ({ post, onEdit, onSave, editingId }) => {
  const [editData, setEditData] = useState({
    title: post.title,
    dept: post.dept,
    content: post.content,
    attachment: post.attachment,
  });

  const isEditing = editingId === post.id;

  const handleSave = () => {
    onSave(post.id, editData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-purple-100 p-2 rounded-full">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            Official Announcement
          </span>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : onEdit(post.id))}
          className="text-gray-500 hover:text-purple-600 transition-colors"
        >
          {isEditing ? (
            <Save className="w-5 h-5" />
          ) : (
            <Edit2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="w-full text-xl font-bold border-b-2 border-purple-200 focus:border-purple-500 outline-none bg-transparent"
            placeholder="Announcement title"
          />
          <input
            type="text"
            value={editData.dept}
            onChange={(e) => setEditData({ ...editData, dept: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 outline-none"
            placeholder="Department"
          />
          <textarea
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
            className="w-full text-gray-600 border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 outline-none resize-none"
            rows="4"
            placeholder="Announcement content"
          />
          {/* Allow editing attachment */}
          <input
            type="text"
            value={editData.attachment}
            onChange={(e) =>
              setEditData({ ...editData, attachment: e.target.value })
            }
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 outline-none"
            placeholder="Attachment file name or URL"
          />
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
              {post.dept}
            </span>
            <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

          {post.attachment && (
            <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">{post.attachment}</span>
              <button className="ml-auto text-purple-600 hover:text-purple-800 text-sm font-medium">
                Download
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnnouncementCard;
