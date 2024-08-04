import PromptCard from "./PromptCard";

const Profile = ({ data, likes, handleEdit, handleDelete }) => {
  return (
    <section className='mt-4 w-full space-y-4'>

      <div>
        <p className='font-inter text-center blue_gradient'>Posts</p>
        <div className='prompt_layout'>
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

      {likes?.length > 0 && (
        <div>
          <p className='font-inter text-center blue_gradient'>Likes</p>
          <div className='prompt_layout'>
            {likes.map((like) => (
              <PromptCard
                key={like._id}
                post={like}
              />
            ))}
          </div>
        </div>
      )}


    </section>
  );
};

export default Profile;