"use client";

import { cn } from "../../lib/utils"
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        link: string;
        img: string;
        title: string;
        name: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards"
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse"
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "30s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "50s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "70s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
                className
            )}
            style={{
                "--animation-duration": "70s",
                "--animation-direction": "forwards",
                "--gap": "1rem"
            } as React.CSSProperties}
        >            
        <ul
            ref={scrollerRef}
            className={cn(
                "flex w-max shrink-0 gap-4 py-4 flex-nowrap",
                start && "animate-scroll ",
                pauseOnHover && "hover:[animation-play-state:paused]"
            )}
            style={{
                gap: "var(--gap)"
            } as React.CSSProperties}
        >                {items.map((item, idx) => (
                    <li
                        className="max-w-full relative rounded-2xl transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-lg bg-gradient-to-br from-black to-slate-950/50"
                        key={`li-${item.title}-${idx}`}
                    >                        
                        <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={item.title}
                            className="block"
                        >
                            <img
                                key={`img-${item.title}-${idx}`}
                                className="rounded-xl w-[300px] h-auto object-contain"
                                src={item.img}
                                alt={item.title}
                                loading="lazy"
                                style={{
                                    willChange: "transform",
                                    imageRendering: "auto"
                                }}
                            />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};