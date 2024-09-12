import { useState } from 'react';
import CopyShareButton from './CopyShareButton';
import XShareButton from './XShareButton';
import { CloseFilledIcon, ShareIcon } from '@constants/icons';
import WhatsappSharebtn from './WhatsappSharebtn';
import LinkedInShareBtn from './LinkedInShareBtn';
import MailShareBtn from './MailShareBtn';

const Sharing = ({ entity, user, entityType }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const url = `${window.location.origin}/promptDetails/${entity?._id}`;

  // Dynamic title or prompt text
  const title = entityType === "prompt" ? entity?.prompt : entity?.content;

  return (
    <div>
      <button
        onClick={() => setIsShareModalOpen(true)}
        disabled={entity?.creator?._id === user?.id} // Disable if user is the creator
        className={`w-4 h-4 text-gray-600 hover:text-gray-900 ${entity?.creator?._id === user?.id ? "" : "cursor-pointer"}`}
      >
        <ShareIcon />
      </button>

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 p-2">
          <div className="bg-white p-5 rounded shadow-lg relative w-full h-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsShareModalOpen(false)}
            >
              <CloseFilledIcon className={"w-6 h-6"} />
            </button>

            <h2 className="mt-2 text-center text-xl font-bold mb-4">
              Share this {entityType}
            </h2>

            <div className="flex justify-center items-center space-x-4 text-gray-600 hover:text-gray-900">
              <CopyShareButton url={url} />
              <XShareButton url={url} title={title} hashtags={entity.tags || []} />
              <WhatsappSharebtn url={url} title={title} />
              <LinkedInShareBtn url={url} title={title} />
              <MailShareBtn url={url} title={title} body={title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sharing;
