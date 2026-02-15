import React from "react";

export const CATEGORY_COLORS: Record<string, string> = {
  Graphic: "#42ff00",
  Identity: "#FFEB23",
  Website: "#7CEEFF",
  Editorial: "#D8BAFF",
  Motion: "#8683FF",
  Space: "#FF99E2",
  Practice: "#FF590C",
  Press: "#6A6A6A",
  Everyday: "#FF9999",
};

export const CATEGORIES = [
  "All Types",
  "Graphic",
  "Editorial",
  "Website",
  "Identity",
  "Space",
  "Practice",
  "Motion",
  "Press",
  "Everyday",
];

interface CategoryTagProps {
  categories?: string[];
  className?: string;
}

const CategoryTag = React.memo(
  ({ categories, className = "" }: CategoryTagProps) => {
    if (!categories?.length) return null;

    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {categories.map((category: string, index: number) => (
          <span
            key={`${category}-${index}`}
            className="px-[0.35rem] py-[0.15rem] rounded-[4px] text-[11px] leading-none font-medium font-ep-sans text-system-dark"
            style={{
              backgroundColor: CATEGORY_COLORS[category] || "#787878",
            }}
          >
            {category}
          </span>
        ))}
      </div>
    );
  },
);

CategoryTag.displayName = "CategoryTag";

export default CategoryTag;
