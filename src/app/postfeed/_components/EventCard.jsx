import { useState } from "react";
import { Calendar, MapPin, Edit2, Save, Clock, Users } from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import PDFDownloads from "./PDFDownloads";
import FileUploadSection from "./FileUpload";
import CommentsSection from "./CommentsSection";

const EventCard = ({ post, onEdit, onSave, editingId, onAddComment, onAddReply }) => {
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