import { useState } from "react";
import { MessageCircle, Send, Reply, Image, Sparkles } from "lucide-react";

const CommentsSection = ({ 
  postId, 
  comments = [], 
  onAddComment, 
  onAddReply 
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isGeneratingMeme, setIsGeneratingMeme] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsGeneratingMeme(newComment.toLowerCase().startsWith('/meme '));
    
    try {
      await onAddComment(postId, newComment);
      setNewComment("");
    } finally {
      setIsGeneratingMeme(false);
    }
  };

  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsGeneratingMeme(replyText.toLowerCase().startsWith('/meme '));
    
    try {
      await onAddReply(postId, commentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    } finally {
      setIsGeneratingMeme(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mb-4'} p-4 bg-gray-50 rounded-2xl`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {comment.author.charAt(0)}
          </div>
          <span className="font-semibold text-gray-800">{comment.author}</span>
          <span className="text-gray-500 text-sm">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">{comment.text}</p>
      
      {comment.memeUrl && (
        <div className="mb-3 rounded-xl overflow-hidden border-2 border-purple-200 shadow-lg">
          <img
            src={comment.memeUrl}
            alt="Generated meme"
            className="w-full max-w-sm h-auto"
          />
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-800 text-sm font-medium">
              AI Generated Meme
            </span>
          </div>
        </div>
      )}
      
      {!isReply && (
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
          
          {comment.replies && comment.replies.length > 0 && (
            <span className="text-gray-500">
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>
      )}
      
      {replyingTo === comment.id && (
        <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type /meme [prompt] for AI meme generation..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGeneratingMeme}
            />
            <button
              type="submit"
              disabled={!replyText.trim() || isGeneratingMeme}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 flex items-center space-x-2"
            >
              {isGeneratingMeme ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="text-sm">Generating...</span>
                </>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">
            {comments.length === 0 
              ? "Add Comment" 
              : `${comments.length} Comment${comments.length === 1 ? '' : 's'}`
            }
          </span>
        </button>
      </div>

      {showComments && (
        <div className="space-y-4">
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex space-x-3">
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts... Type /meme [prompt] to generate AI memes!"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  disabled={isGeneratingMeme}
                />
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Image className="w-4 h-4" />
                    <span>Type /meme [your idea] for AI meme generation</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isGeneratingMeme}
                className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 flex items-center space-x-2 font-medium shadow-lg"
              >
                {isGeneratingMeme ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Generating Meme...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;