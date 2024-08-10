import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";

export const POST = async (request, { params }) => {
  const { userId, rating } = await request.json();

  if (!userId || rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ message: 'Invalid userId or rating' }), { status: 400 });
  }

  try {
    await connectToDB();

    // Find the prompt by ID
    const prompt = await Prompt.findById(params.id);

    if (!prompt) {
      return new Response(JSON.stringify({ message: 'Prompt not found' }), { status: 404 });
    }

    // Check if the user has already rated the prompt
    // `ratingObject` represents each rating object in the `post.ratings` array.
    // The `.find` method searches for the rating object where the `userId` matches the current user's ID.
    // The `toString()` method ensures the comparison is between string values.
    // If a match is found, `existingRating` will be assigned the rating object value from that object.
    const existingRating = prompt.ratings.find(ratingObject => ratingObject.userId.toString() === userId);

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Add new rating
      prompt.ratings.push({ userId, rating });
    }

    // Calculate new average rating
    const totalRatings = prompt.ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRatings / prompt.ratings.length;

    prompt.averageRating = averageRating;
    await prompt.save();

    // Return the updated average rating and user's current rating
    return new Response(JSON.stringify({
      averageRating: averageRating.toFixed(1),
      userRating: existingRating ? existingRating.rating : rating,
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error updating rating:', error);
    return new Response(JSON.stringify({ message: 'Error updating rating' }), { status: 500 });
  }
  
};
  
