import { useState } from "react";
import { Calendar, MapPin, Edit2, Save, Clock, Users } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import PDFDownloads from "./PDFDownloads";
import FileUploadSection from "./FileUpload";

const EventCard = ({ post, onEdit, onSave, editingId }) => {
  // Dummy images for fallback
  const dummyImages = [
    {
      id: 1,
      url: "https://picsum.photos/800/400?random=1",
      name: "Dummy 1",
    },
    {
      id: 2,
      url: "https://picsum.photos/800/400?random=2",
      name: "Dummy 2",
    },
    {
      id: 3,
      url: "https://picsum.photos/800/400?random=3",
      name: "Dummy 3",
    },
  ];

  const [editData, setEditData] = useState({
    title: post.title,
    description: post.description,
    location: post.location,
    date: post.date,
    images: post.images || [],
    attachments: post.attachments || [],
  });
  const [rsvpStatus, setRsvpStatus] = useState("none");
  const [rsvpCounts, setRsvpCounts] = useState({
    going: post.goingCount || 0,
    interested: post.interestedCount || 0,
    notGoing: post.notGoingCount || 0,
  });

  const isEditing = editingId === post.id;

  const handleSave = () => {
    onSave(post.id, editData);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: event.target.result,
          name: file.name,
          file: file,
        };
        setEditData((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    setEditData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
  };

  const removeImage = (imageId) => {
    setEditData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const removeAttachment = (attachmentId) => {
    setEditData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }));
  };

  const handleRSVP = (status) => {
    const newCounts = { ...rsvpCounts };

    if (rsvpStatus !== "none") {
      newCounts[rsvpStatus] = Math.max(0, newCounts[rsvpStatus] - 1);
    }

    if (status !== "none") {
      newCounts[status] = newCounts[status] + 1;
    }

    setRsvpCounts(newCounts);
    setRsvpStatus(status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
      {/* Image Carousel Section */}
      {!isEditing && (
        <ImageCarousel
          images={
            post.images && post.images.length > 0 ? post.images : dummyImages
          }
        />
      )}

      {/* Card Content */}
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full">
                🎉 Event
              </span>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {rsvpCounts.going + rsvpCounts.interested} interested
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    Posted{" "}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "recently"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : onEdit(post.id))}
            className="text-gray-500 hover:text-blue-600 transition-colors p-3 hover:bg-blue-50 rounded-2xl group"
          >
            {isEditing ? (
              <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
            ) : (
              <Edit2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full text-3xl font-bold border-b-2 border-blue-200 focus:border-blue-600 outline-none bg-transparent pb-3 placeholder-gray-400"
                placeholder="Enter event title..."
              />

              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full text-gray-700 border-2 border-gray-200 rounded-2xl p-4 focus:border-blue-500 outline-none resize-none min-h-[120px] placeholder-gray-400"
                rows="4"
                placeholder="Describe your event in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 outline-none placeholder-gray-400"
                  placeholder="Enter event location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={editData.date}
                  onChange={(e) =>
                    setEditData({ ...editData, date: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* File Upload Section */}
            <FileUploadSection
              editData={editData}
              setEditData={setEditData}
              onImageUpload={handleImageUpload}
              onAttachmentUpload={handleAttachmentUpload}
              onRemoveImage={removeImage}
              onRemoveAttachment={removeAttachment}
            />
          </div>
        ) : (
          <>
            {/* Event Title and Description */}
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Location
                  </p>
                  <p className="text-gray-800 font-medium">{post.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                <div className="bg-purple-500 p-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-800">
                    Date & Time
                  </p>
                  <p className="text-gray-800 font-medium">
                    {formatDate(post.date)}
                    {formatTime(post.date) && (
                      <span className="text-gray-600 ml-2">
                        {formatTime(post.date)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* PDF Downloads Section */}
            <PDFDownloads attachments={post.attachments} />
          </>
        )}

        {/* RSVP Buttons
        {!isEditing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">
                Will you attend?
              </h4>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>{rsvpCounts.going} going</span>
                <span>{rsvpCounts.interested} interested</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRSVP("going")}
                className={`py-4 px-4 rounded-2xl font-bold transition-all duration-200 ${
                  rsvpStatus === "going"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700 hover:scale-105"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-sm">Going</span>
                  {rsvpCounts.going > 0 && (
                    <span className="text-xs opacity-75">
                      {rsvpCounts.going}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleRSVP("interested")}
                className={`py-4 px-4 rounded-2xl font-bold transition-all duration-200 ${
                  rsvpStatus === "interested"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700 hover:scale-105"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm">Interested</span>
                  {rsvpCounts.interested > 0 && (
                    <span className="text-xs opacity-75">
                      {rsvpCounts.interested}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleRSVP("notGoing")}
                className={`py-4 px-4 rounded-2xl font-bold transition-all duration-200 ${
                  rsvpStatus === "notGoing"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 hover:scale-105"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">❌</span>
                  <span className="text-sm">Can't Go</span>
                  {rsvpCounts.notGoing > 0 && (
                    <span className="text-xs opacity-75">
                      {rsvpCounts.notGoing}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default EventCard;
