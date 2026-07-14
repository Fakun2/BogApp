"use client";

import { useRef, useState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateStaffPhotoDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];

    if (file) {
      setFileName(file.name);
    }
  }

  return (
    <div
      className={cn(
        "grid cursor-pointer gap-3 rounded-2xl border border-dashed border-border/60 bg-secondary/20 p-4 transition-colors hover:border-sky-300/70 hover:bg-sky-50/40 md:col-span-2",
        isDragging && "border-sky-400 bg-sky-50/70"
      )}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card text-sky-700">
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Foto del empleado</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {fileName || "Arrastra una imagen o hace click para cargarla."}
          </p>
        </div>
        <UploadCloud className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  );
}
