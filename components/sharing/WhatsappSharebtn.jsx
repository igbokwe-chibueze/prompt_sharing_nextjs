import { WhatsappIcon } from '@constants/icons';
import { shareOnWhatsapp } from './socialShare';

const WhatsappSharebtn = ({url, title}) => {

    const handleShare = () => {
        shareOnWhatsapp({url, title});
    };
    
  return (
    <button onClick={handleShare} className="text-gray-600 hover:text-gray-900">
      <WhatsappIcon className="w-5 h-5" />
    </button>
  )
}

export default WhatsappSharebtn