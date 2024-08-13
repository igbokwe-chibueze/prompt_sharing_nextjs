import { useState, useEffect } from 'react';
import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  // Initialize tags state with post.tags if available, otherwise start with one empty tag
  const [tags, setTags] = useState(post.tags.length > 0 ? post.tags : ['']);

  // Update tags state whenever post.tags changes
  useEffect(() => {
    setTags(post.tags.length > 0 ? post.tags : ['']);
  }, [post.tags]);

  /**
   * Handles changes to a tag input field.
   * @param {number} index - The index of the tag field being changed.
   * @param {string} value - The new value for the tag field.
   */
  const handleTagChange = (index, value) => {
    // Create a new tags array with the updated value
    const newTags = [...tags];
    newTags[index] = value;
    // Update the state with non-empty tags
    setTags(newTags);
    setPost({ ...post, tags: newTags.filter(tag => tag.trim()) });
  };

  /**
   * Adds a new empty tag input field.
   */
  const addTagField = () => {
    // Add a new empty tag to the tags array
    setTags([...tags, '']);
  };

  /**
   * Removes a tag input field.
   * @param {number} index - The index of the tag field to remove.
   */
  const removeTagField = (index) => {
    // Filter out the tag at the specified index
    const newTags = tags.filter((_, i) => i !== index);
    // Update the state with the remaining tags
    setTags(newTags);
    setPost({ ...post, tags: newTags.filter(tag => tag.trim()) });
  };

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Post</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Your AI Prompt
          </span>

          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder='Write your post here'
            required
            className='form_textarea'
          />
        </label>

        <div className='flex flex-col space-y-4'>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Field of Prompt{" "}
            <span className='font-normal'>
              (#product, #webdevelopment, #idea, etc.)
            </span>
          </span>
          {/* Render tag input fields */}
          {tags.map((tag, index) => (
            <div key={index} className='flex items-center gap-2 mb-2'>
              <input
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                type='text'
                placeholder='#Tag'
                className='form_input flex-1'
              />
              {tags.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeTagField(index)}
                  className='text-red-500'
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type='button'
            onClick={addTagField}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white w-fit'
          >
           + Add More Tags
          </button>
        </div>

        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/' className='text-gray-500 text-sm'>
            Cancel
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='px-5 py-1.5 text-sm bg-green-700 rounded-full text-white'
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
