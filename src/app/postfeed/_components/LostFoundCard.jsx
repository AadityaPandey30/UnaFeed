import { useState } from "react";
import { Users, Save, Edit2, MapPin, FileText } from "lucide-react";

const LostFoundCard = ({ post, onEdit, onSave, editingId }) => {
  const [editData, setEditData] = useState({
    item: post.item,
    location: post.location,
    image: post.image,
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
          <div className="bg-orange-100 p-2 rounded-full">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
              post.type === "lost"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {post.type === "lost" ? "Lost" : "Found"}
          </span>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : onEdit(post.id))}
          className="text-gray-500 hover:text-orange-600 transition-colors"
        >
          {isEditing ? (
            <Save className="w-5 h-5" />
          ) : (
            <Edit2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Info */}
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editData.item}
                onChange={(e) =>
                  setEditData({ ...editData, item: e.target.value })
                }
                className="w-full text-xl font-bold border-b-2 border-orange-200 focus:border-orange-500 outline-none bg-transparent"
                placeholder="Item name"
              />
              <input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-orange-500 outline-none"
                placeholder="Last seen location"
              />
              {/* Allow editing image URL */}
              <input
                type="text"
                value={editData.image}
                onChange={(e) =>
                  setEditData({ ...editData, image: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-orange-500 outline-none"
                placeholder="Image URL"
              />
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {post.item}
              </h3>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Last seen: {post.location}</span>
              </div>
              <p className="text-gray-600 text-sm">
                {post.type === "lost"
                  ? "If found, please contact."
                  : "Found item - looking for owner."}
              </p>
            </>
          )}
        </div>

        {/* Right: Image */}
        <div className="flex justify-center">
          {editData.image ? (
            <img
              src={editData.image}
              alt={editData.item}
              className="w-full h-32 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LostFoundCard;
