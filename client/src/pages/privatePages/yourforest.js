import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import { fetchLoginStreak } from '../../api/auth'; // Import your API call

// Simple Tree component
const Tree = () => {
  return (
    <div className="tree">
      <img src="/images/tree1.png" alt="Tree" />
    </div>
  );
};

// Utility function to randomly select grid cells for trees
const getRandomTreePositions = (gridSize, treeCount) => {
  const positions = new Set();

  // Randomly select `treeCount` unique positions in the grid
  while (positions.size < treeCount) {
    const randomPosition = Math.floor(Math.random() * gridSize);
    positions.add(randomPosition);
  }

  return positions;
};

// Forest component that renders trees based on login streak
const YourForest = () => {
  const [treeCount, setTreeCount] = useState(0); // State to store the number of trees
  const [gridSize] = useState(36); // Define the grid size (e.g., 36 boxes = 6x6 grid)
  const [treePositions, setTreePositions] = useState(new Set()); // To store positions of trees
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  useEffect(() => {
    const getLoginStreak = async () => {
      try {
        const response = await fetchLoginStreak(); // Fetch the login streak
        setTreeCount(response.data.loginStreak);   // Update the tree count
        setTreePositions(getRandomTreePositions(gridSize, response.data.loginStreak)); // Set random tree positions
        setLoading(false);                         // Set loading to false
      } catch (error) {
        setError('Failed to fetch the login streak.');
        setLoading(false);                         // Set loading to false even if there's an error
      }
    };

    getLoginStreak();
  }, [gridSize]);

  if (loading) {
    return <p>Loading your forest...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <div className="forest-container">
        <h1>Your Forest</h1>
        <div className="forest-grid">
          {/* Render the grid boxes, showing trees in random positions */}
          {[...Array(gridSize)].map((_, index) => (
            <div key={index} className="grid-box">
              {treePositions.has(index) && <Tree />} {/* Place a tree if it's a selected position */}
            </div>
          ))}
        </div>
      </div>

      {/* CSS for the grid and trees */}
      <style jsx>{`
        .forest-container {
          text-align: center;
          margin-top: 20px;
        }
        .forest-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr); /* 6x6 grid */
          width: 500px;
          height: 500px;
          margin: 0 auto;
          border: 1px solid #ccc; /* Outer border */
        }
        .grid-box {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: lightgreen;
        }
        .tree img {
          width: 60px; /* Adjust the tree size */
          height: auto;
        }
      `}</style>
    </Layout>
  );
};

export default YourForest;
