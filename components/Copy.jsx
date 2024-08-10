import { useState } from 'react';
import Image from 'next/image';


const Copy = ({ post }) => {

    const [copied, setCopied] = useState(""); // State to manage copied prompt

    // Handles copying the prompt text to clipboard
    const handleCopy = () => {
        setCopied(post.prompt);
        navigator.clipboard.writeText(post.prompt);
        setTimeout(() => setCopied(""), 3000); // Reset copied state after 3 seconds
    };

  return (
    <>
        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
    </>
  )
}

export default Copy