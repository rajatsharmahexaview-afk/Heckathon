import React from "react";
import { EDUCATIONAL_CONTENT } from "@/config/constants";

const EducationalContent: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Learn About Finance 📚</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Simple explanations to help you understand saving and investing
        </p>
      </div>

      <div className="space-y-4">
        {EDUCATIONAL_CONTENT.map((item) => (
          <details
            key={item.id}
            className="bg-card rounded-2xl border shadow-soft group"
          >
            <summary className="flex items-center gap-4 p-5 cursor-pointer list-none select-none hover:bg-secondary/50 rounded-2xl transition-colors">
              <span className="text-3xl">{item.icon}</span>
              <h2 className="text-xl font-bold flex-1">{item.title}</h2>
              <span className="text-2xl text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-5 pt-0">
              <p className="text-base text-foreground leading-relaxed pl-14">
                {item.summary}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default EducationalContent;
