"use client";

import { XIcon } from "@constants/icons";
import { shareOnX } from "./socialShare";

const XShareButton = ({ url, title, hashtags }) => {

  const handleShare = () => {
    shareOnX({url, title, hashtags});
  };

  return (
    <button onClick={handleShare} className="text-gray-600 hover:text-gray-900">
      <XIcon className="w-5 h-5" />
    </button>
  );
};

export default XShareButton;
