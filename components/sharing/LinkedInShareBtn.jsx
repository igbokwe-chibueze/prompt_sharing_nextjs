import { shareOnLinkedIn } from './socialShare';
import { LinkedInIcon } from '@constants/icons';

const LinkedInShareBtn = ({url, title}) => {

    const handleShare = () => {
        shareOnLinkedIn({url, title});
    };

  return (
    <button onClick={handleShare} className="text-gray-600 hover:text-gray-900">
      <LinkedInIcon className="w-5 h-5" />
    </button>
  )
}

export default LinkedInShareBtn