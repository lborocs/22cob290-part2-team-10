import React, { useState } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <div
        style={{ width: `${progress}%`, backgroundColor: "blue", height: 20 }}
      />
      <button onClick={() => setProgress(progress + 10)}>
        Increase Progress
      </button>
    </div>
  );
};

export default ProgressBar;
