import { useState } from "react";
import { Camera, Upload, Send, X } from "lucide-react";

// Input Form Component
const InputForm = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);

    Promise.resolve(onSubmit(prompt, selectedFiles)).finally(() => {
      setPrompt("");
      setSelectedFiles([]);
      setIsLoading(false);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to post? Describe an event, report lost/found items, or make an announcement..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-none transition-colors text-black"
            rows="4"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-2 flex items-center space-x-2"
                >
                  <span className="text-sm text-gray-600 max-w-32 truncate">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <label className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Camera className="w-5 h-5" />
              <span className="text-sm">Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <label className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="text-sm">File</span>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !prompt.trim() || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Posting...</span>
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
    </div>
  );
};

export default InputForm;
