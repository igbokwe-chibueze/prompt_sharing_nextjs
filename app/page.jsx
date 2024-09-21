//app/page.jsx

import Feed from "@components/feedDir/Feed"
import UserPictures from "@components/UserPictures"


const Home = () => {
  return (
    <section className='relative w-full flex-center flex-col'>
        <h1 className='head_text text-center'>
            Discover & Share
            <br className='max-md:hidden' />
            <span className='orange_gradient text-center'> AI-Powered Prompts</span>
        </h1>
        <p className='desc text-center'>
            Promptopia is an open-source AI prompting tool for modern world to
            discover, create and share creative prompts
        </p>

        {/* UserPictures component displays random user pictures */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex flex-col items-center space-y-4">
            <p className="desc">Join millions of creators</p>
            <UserPictures/>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <p className="desc">Top creators</p>
            <UserPictures/>
          </div>
        </div>

        {/* Feed component displays prompts */}
        <Feed />
    </section>
  )
}

export default Home