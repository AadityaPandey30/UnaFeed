"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import InputForm from "./_components/InputForm";
import EventCard from "./_components/EventCard";
import LostFoundCard from "./_components/LostFoundCard";
import AnnouncementCard from "./_components/AnnouncementCard";
import CommentsSection from "./_components/CommentsSection";

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

  // API call to generate meme
  const generateMeme = async (prompt) => {
    try {
      const response = await fetch("/api/ai/meme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate meme");
      }

      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error("Error generating meme:", error);
      throw error;
    }
  };

  // API call to classify post type
  const classifyPostType = async (prompt) => {
    try {
      const response = await fetch("/api/ai/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to classify post type");
      }

      const result = await response.json();
      return result.type;
    } catch (error) {
      console.error("Error classifying post type:", error);
      throw error;
    }
  };

  // API call to generate event data
  const generateEventData = async (prompt) => {
    try {
      const response = await fetch("/api/ai/generate/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate event data");
      }

      const result = await response.json();
      return result.event;
    } catch (error) {
      console.error("Error generating event data:", error);
      throw error;
    }
  };

  // API call to generate announcement data
  const generateAnnouncementData = async (prompt) => {
    try {
      const response = await fetch("/api/ai/generate/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate announcement data");
      }

      const result = await response.json();
      return result.announcement;
    } catch (error) {
      console.error("Error generating announcement data:", error);
      throw error;
    }
  };

  // API call to generate lost/found data
  const generateLostFoundData = async (prompt) => {
    try {
      const response = await fetch("/api/ai/generate/lostfound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate lost/found data");
      }

      const result = await response.json();
      return result.lostfound;
    } catch (error) {
      console.error("Error generating lost/found data:", error);
      throw error;
    }
  };

  // Helper functions for extracting information from prompt (for lost/found)
  const extractItem = (prompt) => {
    const itemKeywords = [
      "phone", "wallet", "keys", "bag", "laptop", "watch", "glasses", "book",
      "notebook", "charger", "headphones", "earphones", "umbrella", "jacket"
    ];
    const words = prompt.toLowerCase().split(" ");

    for (const word of words) {
      if (itemKeywords.some((keyword) => word.includes(keyword))) {
        return word;
      }
    }

    // Try to extract from context
    const lostFoundIndex = words.findIndex(
      (word) => word.includes("lost") || word.includes("found") || word.includes("missing")
    );

    if (lostFoundIndex !== -1 && words[lostFoundIndex + 1]) {
      return words.slice(lostFoundIndex + 1, lostFoundIndex + 3).join(" ");
    }

    return null;
  };

  const extractLocation = (prompt) => {
    const locationKeywords = ["at", "in", "room", "building", "hall", "auditorium", "library", "cafeteria"];
    const words = prompt.toLowerCase().split(" ");

    for (let i = 0; i < words.length; i++) {
      if (locationKeywords.includes(words[i]) && words[i + 1]) {
        return words.slice(i + 1, i + 4).join(" ");
      }
    }
    return null;
  };

  // Main function to create post based on AI classification and generation
  const handleSubmit = async (prompt, files) => {
    if (!prompt.trim() && (!files || files.length === 0)) {
      return; // Don't submit empty posts
    }

    setIsLoading(true);

    try {
      // Step 1: Classify the post type
      const typeNumber = await classifyPostType(prompt);
      console.log(`Post classified as type: ${typeNumber}`);

      let postData;
      let postType;

      // Step 2: Generate data based on classification
      switch (typeNumber) {
        case "1": // Event
          postType = "event";
          const eventData = await generateEventData(prompt);
          postData = {
            id: Date.now(),
            type: "event",
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            date: eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            startAt: eventData.startAt ? new Date(eventData.startAt) : null,
            endAt: eventData.endAt ? new Date(eventData.endAt) : null,
            createdAt: new Date(),
            images: files && files.length > 0 ? files.filter(f => f.type.startsWith('image/')).map((file, index) => ({
              id: Date.now() + index,
              url: URL.createObjectURL(file),
              name: file.name,
              file: file,
            })) : [],
            attachments: files && files.length > 0 ? files.filter(f => !f.type.startsWith('image/')).map((file, index) => ({
              id: Date.now() + index,
              name: file.name,
              size: file.size,
              type: file.type,
              file: file,
            })) : [],
            comments: [], // Initialize empty comments array
          };
          break;

        case "2": // Lost & Found
          postType = "lostfound";
          const lostFoundData = await generateLostFoundData(prompt);
          const hasImages = files && files.some((file) => file.type.startsWith("image/"));
          
          postData = {
            id: Date.now(),
            type: lostFoundData.mode || "lost", // 'lost' or 'found'
            item: lostFoundData.itemName,
            location: lostFoundData.lastSeenLocation,
            description: lostFoundData.description,
            lastSeenAt: lostFoundData.lastSeenAt ? new Date(lostFoundData.lastSeenAt) : new Date(),
            image: hasImages
              ? URL.createObjectURL(files.find((f) => f.type.startsWith("image/")))
              : null,
            createdAt: new Date(),
            comments: [], // Initialize empty comments array
          };
          break;

        case "3": // Announcement
          postType = "announcement";
          const announcementData = await generateAnnouncementData(prompt);
          postData = {
            id: Date.now(),
            type: "announcement",
            title: announcementData.title,
            dept: announcementData.department || "General",
            content: announcementData.description,
            attachment: files && files.length > 0 ? files[0].name : null,
            date: announcementData.date ? new Date(announcementData.date) : new Date(),
            createdAt: new Date(),
            comments: [], // Initialize empty comments array
          };
          break;

        default:
          // Fallback to announcement
          postType = "announcement";
          postData = {
            id: Date.now(),
            type: "announcement",
            title: prompt.split(".")[0] || "New Announcement",
            dept: "General",
            content: prompt,
            attachment: files && files.length > 0 ? files[0].name : null,
            createdAt: new Date(),
          };
      }

      console.log(`Post created:`, postData);
      setPosts((prev) => [postData, ...prev]);

    } catch (error) {
      console.error("Error creating post:", error);
      
      // Fallback to local creation if API fails
      console.log("Falling back to local post creation...");
      const fallbackPost = {
        id: Date.now(),
        type: "announcement",
        title: prompt.split(".")[0] || "New Post",
        dept: "General",
        content: prompt,
        attachment: files && files.length > 0 ? files[0].name : null,
        createdAt: new Date(),
        comments: [], // Initialize empty comments array
      };
      
      setPosts((prev) => [fallbackPost, ...prev]);
      
      // You might want to show an error message to the user here
      alert("There was an issue processing your post, but it has been created as an announcement.");
      
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

  // Handle adding comments (with meme generation support)
  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    let finalComment = commentText;
    let memeUrl = null;

    // Check if comment starts with /meme
    if (commentText.toLowerCase().startsWith('/meme ')) {
      const memePrompt = commentText.substring(6).trim(); // Remove '/meme ' prefix
      
      try {
        memeUrl = await generateMeme(memePrompt);
        finalComment = `Generated meme: ${memePrompt}`;
      } catch (error) {
        console.error("Failed to generate meme:", error);
        finalComment = `Failed to generate meme: ${memePrompt}`;
      }
    }

    const newComment = {
      id: Date.now(),
      text: finalComment,
      memeUrl: memeUrl,
      author: `User${Math.floor(Math.random() * 1000)}`, // Simulated user
      createdAt: new Date(),
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    );
  };

  // Handle adding replies to comments
  const handleAddReply = async (postId, commentId, replyText) => {
    if (!replyText.trim()) return;

    let finalReply = replyText;
    let memeUrl = null;

    // Check if reply starts with /meme
    if (replyText.toLowerCase().startsWith('/meme ')) {
      const memePrompt = replyText.substring(6).trim();
      
      try {
        memeUrl = await generateMeme(memePrompt);
        finalReply = `Generated meme: ${memePrompt}`;
      } catch (error) {
        console.error("Failed to generate meme:", error);
        finalReply = `Failed to generate meme: ${memePrompt}`;
      }
    }

    const newReply = {
      id: Date.now(),
      text: finalReply,
      memeUrl: memeUrl,
      author: `User${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date(),
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, replies: [...comment.replies, newReply] }
                  : comment
              ),
            }
          : post
      )
    );
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
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
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
            Campus Feed
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
            <p className="text-gray-600 mt-2">
              AI is processing your post...
            </p>
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