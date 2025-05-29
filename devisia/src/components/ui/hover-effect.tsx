"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  description: string;
  content: string;
  href: string;
}

interface HoverEffectProps {
  items: Item[];
  className?: string;
}

export function HoverEffect({ items, className }: HoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid", className)}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-6 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-xl bg-gradient-to-r from-primary-100 via-white to-secondary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              hoveredIndex === idx
                ? "opacity-100 border border-primary-200"
                : "opacity-0"
            )}
          />
          
          <div
            className={cn(
              "relative z-10 p-8 rounded-xl bg-white border border-gray-200 transition-all duration-500 transform group-hover:scale-[1.02] group-hover:shadow-xl",
              hoveredIndex === idx ? "scale-[1.02] shadow-xl" : "scale-100"
            )}
          >
            <div className="flex flex-col h-full">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                  <span className="flex-shrink-0 text-primary-600 text-sm font-medium">{item.description}</span>
                </div>
                <p className="text-gray-700">"{item.content}"</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
