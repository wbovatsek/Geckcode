import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import { fetchLoginStreak } from '../../api/auth';
import './YourForest.css'; // Import the new CSS file

// Simple Tree component
const Tree = () => {
  const treeImages = ['/images/tree1.png', '/images/tree4.png', '/images/tree3.png'];

  const randomTreeImage = treeImages[Math.floor(Math.random() * treeImages.length)];

  return (
    <div className="tree">
      <img src={randomTreeImage} alt="Tree" />
    </div>
  );
};

// Utility function to randomly select grid cells for trees
const getRandomTreePositions = (gridSize, treeCount) => {
  const positions = new Set();
  while (positions.size < treeCount) {
    const randomPosition = Math.floor(Math.random() * gridSize);
    positions.add(randomPosition);
  }
  return positions;
};

// Forest component that renders trees based on login streak
const YourForest = () => {
  const [treeCount, setTreeCount] = useState(0);
  const [gridSize] = useState(36);
  const [treePositions, setTreePositions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLoginStreak = async () => {
      try {
        const response = await fetchLoginStreak();
        setTreeCount(response.data.loginStreak);
        setTreePositions(getRandomTreePositions(gridSize, response.data.loginStreak));
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch the login streak.');
        setLoading(false);
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
        <div className="forest-grid">
          {[...Array(gridSize)].map((_, index) => (
            <div key={index} className="grid-box">
              {treePositions.has(index) && <Tree />}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default YourForest;
