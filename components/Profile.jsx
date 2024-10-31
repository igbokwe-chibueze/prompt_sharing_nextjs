import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CommentCard } from './commentsDir';
import PromptCard from './promptDir/PromptCard';
import RepostCard from './feedDir/RepostCard';

const Profile = ({ data, likes, bookmarks, comments, reposts, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const user = session?.user;

  // State to track the active tab
  const [activeTab, setActiveTab] = useState('Posts');

  return (
    <section className='mt-4 w-full space-y-4'>
      {/* Tab navigation */}
      <div className="flex justify-center space-x-16 mb-4">
        <button 
          className={`font-inter p-2 rounded-md hover:bg-slate-400 ${activeTab === 'Posts' ? 'text-blue-500 hover:text-white' : ''}`} 
          onClick={() => setActiveTab('Posts')}
        >
          Posts
        </button>
        <button 
          className={`font-inter p-2 rounded-md hover:bg-slate-400 ${activeTab === 'Likes' ? 'text-blue-500 hover:text-white' : ''}`} 
          onClick={() => setActiveTab('Likes')}
        >
          Likes
        </button>
        <button 
          className={`font-inter p-2 rounded-md hover:bg-slate-400 ${activeTab === 'Bookmarks' ? 'text-blue-500 hover:text-white' : ''}`} 
          onClick={() => setActiveTab('Bookmarks')}
        >
          Bookmarks
        </button>
        <button 
          className={`font-inter p-2 rounded-md hover:bg-slate-400 ${activeTab === 'Comments' ? 'text-blue-500 hover:text-white' : ''}`} 
          onClick={() => setActiveTab('Comments')}
        >
          Comments
        </button>
        <button 
          className={`font-inter p-2 rounded-md hover:bg-slate-400 ${activeTab === 'Reposts' ? 'text-blue-500 hover:text-white' : ''}`} 
          onClick={() => setActiveTab('Reposts')}
        >
          Reposts
        </button>
      </div>

      {/* Content based on active tab */}

      {/* Posts */}
      {activeTab === 'Posts' && (
        <div className="space-y-2">
          <p className='font-inter text-center blue_gradient'>Posts</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {data.length > 0 ? (
              data.map((post) => (
                <PromptCard
                  key={post._id}
                  post={post}
                  handleEdit={() => handleEdit && handleEdit(post)}
                  handleDelete={() => handleDelete && handleDelete(post)}
                />
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      )}

      {/* Likes */}
      {activeTab === 'Likes' && likes?.length > 0 && (
        <div className="space-y-2">
          <p className='font-inter text-center blue_gradient'>Likes</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {likes.map((like) => (
              <PromptCard
                key={like._id}
                post={like}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks */}
      {activeTab === 'Bookmarks' && bookmarks?.length > 0 && (
        <div className="space-y-2">
          <p className='font-inter text-center blue_gradient'>Bookmarks</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {bookmarks.map((bookmark) => (
              <PromptCard
                key={bookmark._id}
                post={bookmark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {activeTab === 'Comments' && comments?.length > 0 && (
        <div className="space-y-2">
          <p className='font-inter text-center blue_gradient'>Comments</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="prompt_card"
              >
                <CommentCard
                  comment={comment}
                  promptDetails={comment.prompt}
                  user={user}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reposts */}
      {activeTab === 'Reposts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(reposts?.prompts.length > 0 || reposts?.comments.length > 0) ? (
            <>
              {/* Map through reposted prompts */}
              {reposts.prompts.map((prompt) =>
                prompt.reposts.map((repost) => (
                  <RepostCard
                    key={repost._id}
                    repost={repost}
                    originalPost={prompt}
                    cardType="prompt"
                  />
                ))
              )}

              {/* Map through reposted comments */}
              {reposts.comments.map((comment) =>
                comment.reposts.map((repost) => (
                  <RepostCard
                    key={repost._id}
                    repost={repost}
                    originalPost={comment}
                    cardType="comment"
                  />
                ))
              )}
            </>
          ) : (
            <p>No reposts available.</p>
          )}
        </div>
      )}

    </section>
  );
};

export default Profile;
