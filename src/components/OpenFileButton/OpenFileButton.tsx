import FileOpenIcon from "@mui/icons-material/FileOpen";
import IconButton from "@mui/material/IconButton";
import React, { useRef } from "react";

interface ImportFileButtonProps {
  accept?: string;
}

export function OpenFileButton({
  accept = ".obf, .obz",
}: ImportFileButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // TODO: Handle the file
      console.log(files[0]);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Import"
        size="large"
        color="inherit"
        onClick={handleButtonClick}
      >
        <FileOpenIcon />
      </IconButton>

      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
