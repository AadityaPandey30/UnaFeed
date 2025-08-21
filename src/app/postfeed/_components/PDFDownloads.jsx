import { Download, FileText, ExternalLink, File } from "lucide-react";

const PDFDownloads = ({ attachments = [], title = "Downloads & Resources" }) => {
  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return {
          icon: '📄',
          color: 'from-red-500 to-red-600',
          bgColor: 'from-red-50 to-red-100',
          borderColor: 'border-red-200'
        };
      case 'doc':
      case 'docx':
        return {
          icon: '📝',
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'ppt':
      case 'pptx':
        return {
          icon: '📊',
          color: 'from-orange-500 to-orange-600',
          bgColor: 'from-orange-50 to-orange-100',
          borderColor: 'border-orange-200'
        };
      case 'xls':
      case 'xlsx':
        return {
          icon: '📈',
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          borderColor: 'border-green-200'
        };
      case 'txt':
        return {
          icon: '📃',
          color: 'from-gray-500 to-gray-600',
          bgColor: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          icon: '📎',
          color: 'from-purple-500 to-purple-600',
          bgColor: 'from-purple-50 to-purple-100',
          borderColor: 'border-purple-200'
        };
    }
  };

  const downloadFile = (attachment) => {
    if (attachment.file) {
      const url = URL.createObjectURL(attachment.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (attachment.url) {
      // For remote files
      window.open(attachment.url, '_blank');
    }
  };

  const previewFile = (attachment) => {
    if (attachment.file && attachment.name.toLowerCase().endsWith('.pdf')) {
      const url = URL.createObjectURL(attachment.file);
      window.open(url, '_blank');
    } else if (attachment.url) {
      window.open(attachment.url, '_blank');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800 flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {title}
          <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
            {attachments.length}
          </span>
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attachments.map((attachment, index) => {
          const fileInfo = getFileIcon(attachment.name);
          const isPDF = attachment.name.toLowerCase().endsWith('.pdf');
          
          return (
            <div 
              key={attachment.id || index}
              className={`group relative bg-gradient-to-r ${fileInfo.bgColor} border ${fileInfo.borderColor} rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer`}
            >
              {/* File Icon and Type Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <span className="text-2xl">{fileInfo.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2">
                      {attachment.name}
                    </h5>
                    {attachment.size && (
                      <p className="text-sm text-gray-500 mt-1">
                        {formatFileSize(attachment.size)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* File Description */}
              {attachment.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {attachment.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadFile(attachment)}
                  className={`flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r ${fileInfo.color} text-white px-4 py-2.5 rounded-xl hover:shadow-md transition-all duration-200 font-medium`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                
                {isPDF && (
                  <button
                    onClick={() => previewFile(attachment)}
                    className="flex items-center justify-center bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-xl transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Download Count (if available) */}
              {attachment.downloadCount && (
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-2 py-1 rounded-full">
                  {attachment.downloadCount} downloads
                </div>
              )}

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {attachments.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <File className="w-4 h-4" />
            <span>{attachments.length} files available</span>
          </div>
          {attachments.some(a => a.name.toLowerCase().endsWith('.pdf')) && (
            <div className="flex items-center space-x-1">
              <span>📄</span>
              <span>{attachments.filter(a => a.name.toLowerCase().endsWith('.pdf')).length} PDF documents</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>Total size: {formatFileSize(attachments.reduce((sum, file) => sum + (file.size || 0), 0))}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFDownloads;