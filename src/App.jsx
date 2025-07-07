import React, { useState } from 'react';
import './App.css';


const API_KEY = 'live_neIIL0ikdMOt5BVklexSO8hcNME52ZjWMVddLLXVbzQorojNH8ieusZAYN3BD9g4';

function App() {
  const [dog, setDog] = useState(null);
  const [banList, setBanList] = useState([]);
  const [loading, setLoading] = useState(false);

  // check whether this dog’s attributes conflict with the ban list
  const isBanned = result => {
    const breed = result.breeds?.[0]?.name;
    const weight = result.breeds?.[0]?.weight?.imperial;
    const origin = result.breeds?.[0]?.origin;
    const lifeSpan = result.breeds?.[0]?.life_span;
    return [breed, weight, origin, lifeSpan].some(attr => banList.includes(attr));
  };

  // fetch until we get one that isn’t banned
  const fetchDog = async () => {
    setLoading(true);
    let result, attempts = 0;

    do {
      const res = await fetch('https://api.thedogapi.com/v1/images/search', {
        headers: { 'x-api-key': API_KEY }
      });
      const data = await res.json();
      result = data[0];
      attempts++;
    } while (isBanned(result) && attempts < 20);

    setDog(result);
    setLoading(false);
  };

  // ban/unban helpers
  const banAttribute = attr => {
    if (!banList.includes(attr)) {
      setBanList([...banList, attr]);
    }
  };
  const unbanAttribute = attr => {
    setBanList(banList.filter(a => a !== attr));
  };

  // safely pull out each attribute (or show “Unknown”)
  const breed    = dog?.breeds?.[0]?.name        || 'Unknown';
  const weight   = dog?.breeds?.[0]?.weight?.imperial || 'Unknown';
  const origin   = dog?.breeds?.[0]?.origin      || 'Unknown';
  const lifespan = dog?.breeds?.[0]?.life_span   || 'Unknown';

  return (
    <div className="app-container">
      {/* ————— Main discovery card ————— */}
      <div className="main-content">
        <div className="discovery-card">
          <h1 className="discovery-title">Doggo Discovery!</h1>
          <p className="discovery-subtitle">
            Discover dogs from your wildest dreams!
          </p>
          <div className="emoji-row">🐶 🐕 🦮 🐩 🐾</div>

          {/* attribute tags (click to ban) */}
          {dog && (
            <div className="attributes-row">
              <button
                className="attribute-tag"
                onClick={() => banAttribute(breed)}
                disabled={banList.includes(breed)}
                title={
                  banList.includes(breed)
                    ? 'Already banned'
                    : 'Click to ban this breed'
                }
              >
                {breed}
              </button>
              <button
                className="attribute-tag"
                onClick={() => banAttribute(weight)}
                disabled={banList.includes(weight)}
                title={
                  banList.includes(weight)
                    ? 'Already banned'
                    : 'Click to ban this weight'
                }
              >
                {weight} lbs
              </button>
              <button
                className="attribute-tag"
                onClick={() => banAttribute(origin)}
                disabled={banList.includes(origin)}
                title={
                  banList.includes(origin)
                    ? 'Already banned'
                    : 'Click to ban this origin'
                }
              >
                {origin}
              </button>
              <button
                className="attribute-tag"
                onClick={() => banAttribute(lifespan)}
                disabled={banList.includes(lifespan)}
                title={
                  banList.includes(lifespan)
                    ? 'Already banned'
                    : 'Click to ban this lifespan'
                }
              >
                {lifespan}
              </button>
            </div>
          )}

          {/* dog image */}
          {dog && (
            <img
              className="dog-img"
              src={dog.url}
              alt={breed}
            />
          )}

          {/* fetch button */}
          <button
            className="discover-btn"
            onClick={fetchDog}
            disabled={loading}
          >
            🔀 {loading ? 'Loading…' : 'Discover!'}
          </button>
        </div>
      </div>

      {/* ————— Ban List sidebar ————— */}
      <div className="sidebar">
        <h2 className="sidebar-title">Ban List</h2>
        <p className="sidebar-desc">
          Select an attribute in your listing to ban it
        </p>

        <div className="ban-list-row">
          {banList.length === 0 && (
            <span className="no-ban">No banned attributes yet.</span>
          )}
          {banList.map((attr, i) => (
            <span
              key={i}
              className="ban-tag"
              onClick={() => unbanAttribute(attr)}
              title="Click to unban"
            >
              {attr} ❌
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;