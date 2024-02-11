"use client";

import { UploadDropzone } from "@/lib/uploadthing";
// import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-indigo-500 text-white p-1 rounded-lg absolute right-2 top-0.5 shadow-md"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-lg bg-background/20">
        <FileIcon className="h-10 w-10 fill-purple-300 stroke-purple-500" />
        <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-md text-purple-400 dark:text-purple-400 hover:underline">
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-indigo-500 text-white p-1 rounded-lg absolute -right-2 -top-0.5 shadow-md"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
