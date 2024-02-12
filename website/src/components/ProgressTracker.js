import React from 'react'

const ProgressTracker = ({ progress, duration }) => {
    const progressPercentage = (progress / duration) * 100;

    return (
        <div className="w-full bg-base-300 rounded-full h-2.5">
            <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressTracker