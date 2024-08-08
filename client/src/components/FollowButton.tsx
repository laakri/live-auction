import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface FollowButtonProps {
  userId: string;          // The ID of the user to be followed/unfollowed
  loggedInUserId: string;  // The ID of the logged-in user
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, loggedInUserId }) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the logged-in user is following the user
    const checkFollowStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/checkFollowUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ follower: loggedInUserId, following: userId }),
        });

        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        setError("Failed to check follow status");
        console.error("Error checking follow status:", err);
      }
    };

    checkFollowStatus();
  }, [userId, loggedInUserId]);

  const handleFollowUnfollow = async () => {
    setLoading(true);
    setError(null);

    try {
      const action = isFollowing ? 'unfollowUser' : 'followUser';
      const response = await fetch(`http://localhost:3000/api/users/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ follower: loggedInUserId, following: userId }),
      });

      const data = await response.json();
      if (data.done) {
        setIsFollowing(!isFollowing);  // Toggle the follow state
      } else {
        setError("Action failed");
      }
    } catch (err) {
      setError("Failed to perform action");
      console.error("Error following/unfollowing user:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isFollowing === null) {
    return <div>Loading...</div>;
  }

  return (
    
     <motion.button
     onClick={handleFollowUnfollow} 
     disabled={loading}
    
     className={`relative overflow-hidden px-3 py-1 rounded-full bg-gradient-to-r ${
       isFollowing ? 'from-red-600 to-pink-600' : 'from-purple-600 to-indigo-600'
     } text-white font-semibold shadow-lg`}
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
   >
           {loading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}

   </motion.button>
  );
};

export default FollowButton;
