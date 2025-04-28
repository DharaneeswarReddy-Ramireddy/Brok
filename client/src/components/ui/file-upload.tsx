import * as React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelected?: (file: File) => void;
  className?: string;
  supportedFormats?: string[];
  maxSizeMB?: number;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      onFileSelected,
      supportedFormats = [".pdf", ".docx"],
      maxSizeMB = 5,
      ...props
    },
    ref
  ) => {
    const [dragActive, setDragActive] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (files: FileList | null) => {
      if (!files || files.length === 0) return;
      
      const file = files[0];
      
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxSizeMB}MB`,
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!supportedFormats.includes(fileExtension)) {
        toast({
          title: "Unsupported file format",
          description: `Please upload a file in one of these formats: ${supportedFormats.join(", ")}`,
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      if (onFileSelected) onFileSelected(file);
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files);
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const clearFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    return (
      <div className={className}>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer hover:border-primary",
            dragActive ? "border-primary bg-blue-50" : "border-gray-300",
            selectedFile ? "bg-blue-50" : ""
          )}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-md">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your resume here, or{" "}
                <span className="text-primary font-medium">browse files</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: {supportedFormats.join(", ")} (Max {maxSizeMB}MB)
              </p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            ref={(el) => {
              // Combine forwardRef and useRef
              if (typeof ref === "function") {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
              inputRef.current = el;
            }}
            onChange={(e) => handleFileChange(e.target.files)}
            accept={supportedFormats.join(",")}
            {...props}
          />
        </div>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
