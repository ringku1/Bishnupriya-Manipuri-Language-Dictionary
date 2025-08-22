import React from "react";
import "./WordDetail.css";

const WordDetail = ({ wordObj, onClose }) => {
  if (!wordObj) return null;

  return (
    <div className="detail-overlay">
      <div className="detail-panel">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="word-title">{wordObj.word}</h2>
        <p className="word-pos">Part of Speech: {wordObj.pos}</p>
        <p className="word-definition">{wordObj.definition}</p>
      </div>
    </div>
  );
};

export default WordDetail;
