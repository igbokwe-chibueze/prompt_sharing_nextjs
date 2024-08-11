// Utility functions for social media sharing

// Copy Link to clipboard
export const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }, (err) => {
      console.error('Failed to copy: ', err);
    });
};

// X Share
export const shareOnX = ({ url, title, hashtags = [] }) => {
    if (!url || !title) {
      throw new Error("URL and title are required for sharing on X.");
    }
  
    const hashtagsString = hashtags.length ? `&hashtags=${hashtags.join(",")}` : "";
    const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}${hashtagsString}`;
    
    window.open(xUrl, "_blank", "noopener,noreferrer");
};
  
// Facebook Share
export const shareOnFacebook = ({ url, title, hashtags = [] }) => {
    if (!url || !title) {
        throw new Error("URL and title are required for sharing on Facebook.");
    }

    const hashtagsString = hashtags.length ? `&hashtags=${hashtags.join(",")}` : "";
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}${hashtagsString}`;

    window.open(facebookUrl, "_blank", "noopener,noreferrer");
};
  
// LinkedIn Share
export const shareOnLinkedIn = ({ url, title }) => {
    if (!url || !title) {
        throw new Error("URL and title are required for sharing on LinkedIn.");
    }

    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;

    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
};

// Mail Share
export const shareViaEmail = ({ url, title, body = "" }) => {
    if (!url || !title) {
        throw new Error("URL and title are required for sharing via email.");
    }

    const emailBody = `${body}\n\n${title} ${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(mailtoUrl, "_blank", "noopener,noreferrer");
};

//Whatsapp Share
export const shareOnWhatsapp = ({ url, title }) => {
    if (!url || !title) {
        throw new Error("URL and title are required for sharing on WhatsApp.");
    }

    const message = `${title} ${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

