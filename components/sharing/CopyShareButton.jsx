"use client";

import { copyToClipboard } from "./socialShare";
import { CopyIcon } from "@constants/icons";

const CopyShareButton = ({ url, onShareSuccess }) => {
  const handleCopy = () => {
    copyToClipboard(url);
    onShareSuccess(); // Simulate a successful share (You may need a different method depending on platform)
  };

  return (
    <button onClick={handleCopy} className="text-gray-800 hover:text-gray-600">
      <CopyIcon className="w-5 h-5" />
    </button>
  );
};

export default CopyShareButton;
