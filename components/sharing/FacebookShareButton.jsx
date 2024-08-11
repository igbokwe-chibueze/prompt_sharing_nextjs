"use client";

import { shareOnFacebook } from "./socialShare";

const FacebookShareButton = ({ url }) => {
  const handleShare = () => {
    shareOnFacebook(url);
  };

  return (
    <button onClick={handleShare} className="text-blue-600 hover:text-blue-800">
      {/* Replace with your Facebook icon */}
      <FacebookIcon className="w-5 h-5" />
    </button>
  );
};

export default FacebookShareButton;
