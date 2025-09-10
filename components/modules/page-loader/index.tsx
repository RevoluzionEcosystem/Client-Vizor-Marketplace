import React from 'react';

export default function PageLoader() {
    return (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-full m-auto flex overflow-hidden">
                <div className="loader-ring">
                    <div className="loader-ring-light"/>
                    <div className="loader-ring-track"/>
                </div>
            </div>
        </div>
    );
}