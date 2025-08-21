"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import InputForm from "./_components/InputForm";
import EventCard from "./_components/EventCard";
import LostFoundCard from "./_components/LostFoundCard";
import AnnouncementCard from "./_components/AnnouncementCard";

export default function PostFeedPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "event",
      title: "Annual Tech Conference 2025",
      description:
        "Join us for an exciting day of technology talks, networking, and innovation. Leading experts will share insights on AI, blockchain, and future tech trends.",
      location: "Main Auditorium, Building A",
      date: "2025-09-15",
      createdAt: new Date("2025-08-20"),
    },
    {
      id: 2,
      type: "lost",
      item: "Blue Samsung Galaxy S23",
      location: "Library, 2nd Floor",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
      createdAt: new Date("2025-08-19"),
    },
    {
      id: 3,
      type: "announcement",
      title: "New Parking Regulations Effective September 1st",
      dept: "Administration",
      content:
        "Please note that new parking regulations will be in effect from September 1st, 2025. All vehicles must display valid parking permits. Violations will result in fines.",
      attachment: "parking_regulations_2025.pdf",
      createdAt: new Date("2025-08-18"),
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // API call to detect post type based on user input
  const detectPostType = async (prompt, files) => {
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      // Add files to FormData if they exist
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      }

      const response = await fetch("/api/detect-post-type", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect post type");
      }

      const result = await response.json();
      return result; // Expected format: { type, data, confidence }
    } catch (error) {
      console.error("Error detecting post type:", error);
      // Fallback to local detection if API fails
      return detectPostTypeLocally(prompt, files);
    }
  };

  // Fallback local detection logic
  const detectPostTypeLocally = (prompt, files) => {
    const lowerPrompt = prompt.toLowerCase();

    // Check for image files that might indicate lost/found items
    const hasImages =
      files && files.some((file) => file.type.startsWith("image/"));

    if (
      lowerPrompt.includes("event") ||
      lowerPrompt.includes("conference") ||
      lowerPrompt.includes("meeting") ||
      lowerPrompt.includes("workshop") ||
      lowerPrompt.includes("seminar") ||
      lowerPrompt.includes("training")
    ) {
      return {
        type: "event",
        data: {
          title: extractTitle(prompt) || "New Event",
          description: prompt,
          location: extractLocation(prompt) || "TBD",
          date: extractDate(prompt) || new Date().toISOString().split("T")[0],
        },
        confidence: 0.8,
      };
    } else if (
      lowerPrompt.includes("lost") ||
      lowerPrompt.includes("found") ||
      lowerPrompt.includes("missing") ||
      hasImages
    ) {
      return {
        type: lowerPrompt.includes("found") ? "found" : "lost",
        data: {
          item: extractItem(prompt) || "Item from prompt",
          location: extractLocation(prompt) || "Location TBD",
          image: hasImages
            ? URL.createObjectURL(
                files.find((f) => f.type.startsWith("image/"))
              )
            : null,
        },
        confidence: hasImages ? 0.9 : 0.7,
      };
    } else {
      return {
        type: "announcement",
        data: {
          title: extractTitle(prompt) || "New Announcement",
          dept: extractDepartment(prompt) || "General",
          content: prompt,
          attachment: files && files.length > 0 ? files[0].name : null,
        },
        confidence: 0.6,
      };
    }
  };

  // Helper functions to extract information from prompt
  const extractTitle = (prompt) => {
    const sentences = prompt.split(".")[0];
    return sentences.length > 50
      ? sentences.substring(0, 47) + "..."
      : sentences;
  };

  const extractLocation = (prompt) => {
    const locationKeywords = [
      "at",
      "in",
      "room",
      "building",
      "hall",
      "auditorium",
    ];
    const words = prompt.toLowerCase().split(" ");

    for (let i = 0; i < words.length; i++) {
      if (locationKeywords.includes(words[i]) && words[i + 1]) {
        return words.slice(i + 1, i + 4).join(" ");
      }
    }
    return null;
  };

  const extractDate = (prompt) => {
    const dateRegex =
      /\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/;
    const match = prompt.match(dateRegex);
    return match ? match[0] : null;
  };

  const extractItem = (prompt) => {
    const itemKeywords = [
      "phone",
      "wallet",
      "keys",
      "bag",
      "laptop",
      "watch",
      "glasses",
    ];
    const words = prompt.toLowerCase().split(" ");

    for (const word of words) {
      if (itemKeywords.some((keyword) => word.includes(keyword))) {
        return word;
      }
    }

    // If no specific item found, try to extract from context
    const lostFoundIndex = words.findIndex(
      (word) =>
        word.includes("lost") ||
        word.includes("found") ||
        word.includes("missing")
    );

    if (lostFoundIndex !== -1 && words[lostFoundIndex + 1]) {
      return words.slice(lostFoundIndex + 1, lostFoundIndex + 3).join(" ");
    }

    return null;
  };

  const extractDepartment = (prompt) => {
    const deptKeywords = {
      admin: "Administration",
      hr: "Human Resources",
      it: "IT Department",
      finance: "Finance",
      marketing: "Marketing",
      operations: "Operations",
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [keyword, dept] of Object.entries(deptKeywords)) {
      if (lowerPrompt.includes(keyword)) {
        return dept;
      }
    }
    return null;
  };

  // Create post based on detected type and data
  const createPostFromDetection = (detection) => {
    const basePost = {
      id: Date.now(),
      type: detection.type,
      createdAt: new Date(),
    };

    switch (detection.type) {
      case "event":
        return {
          ...basePost,
          title: detection.data.title,
          description: detection.data.description,
          location: detection.data.location,
          date: detection.data.date,
        };

      case "lost":
      case "found":
        return {
          ...basePost,
          item: detection.data.item,
          location: detection.data.location,
          image: detection.data.image,
        };

      case "announcement":
        return {
          ...basePost,
          title: detection.data.title,
          dept: detection.data.dept,
          content: detection.data.content,
          attachment: detection.data.attachment,
        };

      default:
        return {
          ...basePost,
          type: "announcement",
          title: "New Post",
          dept: "General",
          content: detection.data.content || "New post content",
          attachment: null,
        };
    }
  };

  const handleSubmit = async (prompt, files) => {
    if (!prompt.trim() && (!files || files.length === 0)) {
      return; // Don't submit empty posts
    }

    setIsLoading(true);

    try {
      // Call API to detect post type
      const detection = await detectPostType(prompt, files);

      // Create post based on detection results
      const newPost = createPostFromDetection(detection);

      // Add confidence score for debugging (remove in production)
      console.log(
        `Post type detected: ${detection.type} (confidence: ${detection.confidence})`
      );

      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error("Error creating post:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id, editData) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...editData } : post))
    );
    setEditingId(null);
  };

  const renderCard = (post) => {
    switch (post.type) {
      case "event":
        return (
          <EventCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onSave={handleSave}
            editingId={editingId}
          />
        );
      case "lost":
      case "found":
        return (
          <LostFoundCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onSave={handleSave}
            editingId={editingId}
          />
        );
      case "announcement":
        return (
          <AnnouncementCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onSave={handleSave}
            editingId={editingId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Community Feed
          </h1>
          <p className="text-gray-600">
            Share events, lost & found items, and announcements
          </p>
        </div>

        {/* Input Form */}
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Processing your post...</p>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No posts yet</p>
                <p className="text-sm">Be the first to share something!</p>
              </div>
            </div>
          ) : (
            posts.map((post) => renderCard(post))
          )}
        </div>
      </div>
    </div>
  );
}