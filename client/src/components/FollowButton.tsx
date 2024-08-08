import React, { useState } from "react";
import { motion } from "framer-motion";

interface FollowButtonProps {
  onClick?: () => void; // Optional onClick prop if you still want to pass it from parent
  userId: string; // The ID of the user to be followed
  loggedInUserId: string; // The ID of the logged-in user
}

const FollowButton: React.FC<FollowButtonProps> = ({ onClick, userId, loggedInUserId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollowUser = async () => {
    setLoading(true);
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch('http://localhost:3000/api/users/followUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action,
          follower: loggedInUserId,
          following: userId,
        }),
      });

      // Parsing the JSON response
      const data = await response.json();

      if (data.done) {
        setIsFollowing(!isFollowing); // Toggle follow state
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }

    // Optionally, you can call the onClick function passed from the parent component
    if (onClick) onClick();
  };

  return (
    <motion.button
      onClick={handleFollowUser}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden px-3 py-1 rounded-full bg-gradient-to-r ${
        isFollowing ? 'from-red-600 to-pink-600' : 'from-purple-600 to-indigo-600'
      } text-white font-semibold shadow-lg`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={loading} // Disable the button while loading
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </motion.button>
  );
};

export default FollowButton;
