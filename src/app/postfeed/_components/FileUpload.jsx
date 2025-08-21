import { useRef } from "react";
import { Upload, ImageIcon, X, FileText } from "lucide-react";

const FileUploadSection = ({
  editData,
  setEditData,
  onImageUpload,
  onAttachmentUpload,
  onRemoveImage,
  onRemoveAttachment,
}) => {
  const imageInputRef = useRef(null);
  const attachmentInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "ppt":
      case "pptx":
        return "📊";
      case "xls":
      case "xlsx":
        return "📈";
      case "txt":
        return "📃";
      default:
        return "📎";
    }
  };

  return (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      {/* Upload Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Add Event Images</span>
        </button>

        <button
          type="button"
          onClick={() => attachmentInputRef.current?.click()}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Upload className="w-5 h-5" />
          <span>Add Documents</span>
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
        onChange={onAttachmentUpload}
        className="hidden"
      />

      {/* Image Preview Section */}
      {editData.images && editData.images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              Event Images
              <span className="ml-2 bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
                {editData.images.length}
              </span>
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {editData.images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2 rounded-b-xl">
                  <p className="text-xs font-medium truncate">{image.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Preview Section */}
      {editData.attachments && editData.attachments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Documents & Files
              <span className="ml-2 bg-green-100 text-green-600 text-sm px-2 py-1 rounded-full">
                {editData.attachments.length}
              </span>
            </h4>
          </div>

          <div className="space-y-3">
            {editData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {/* File Icon */}
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-2xl">
                      {getFileIcon(attachment.name)}
                    </span>
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {attachment.name}
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{formatFileSize(attachment.size)}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {attachment.name.split(".").pop()?.toUpperCase()} file
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      {!editData.images?.length && !editData.attachments?.length && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h5 className="text-lg font-semibold text-gray-800 mb-2">
              Enhance Your Event
            </h5>
            <p className="text-gray-600 text-sm mb-4">
              Add photos to showcase your event and upload documents like
              schedules, brochures, or registration forms.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <ImageIcon className="w-4 h-4" />
                <span>Images: JPG, PNG, WebP</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Docs: PDF, Word, PowerPoint</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
