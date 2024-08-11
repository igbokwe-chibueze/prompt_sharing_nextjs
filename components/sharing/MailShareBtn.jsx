import { EnvelopeIcon } from '@constants/icons';
import { shareViaEmail } from './socialShare';

const MailShareBtn = ({url, title, body}) => {

    const handleShare = () => {
        shareViaEmail({url, title, body})
    };

  return (
    <button onClick={handleShare} className="text-gray-600 hover:text-gray-900">
      <EnvelopeIcon className="w-5 h-5" />
    </button>
  )
}

export default MailShareBtn