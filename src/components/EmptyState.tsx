import React from "react";
import { Code, FileEdit, BookOpen, Search } from "lucide-react";

const QuickAction = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card hover:bg-accent/50 border border-border transition-all duration-300 group">
    <Icon className="w-5 h-5 text-muted-foreground transition-transform group-hover:scale-110" />
    <span className="font-medium text-foreground">{label}</span>
  </button>
);

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 gap-8">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
        How can I help you?
      </h1>
      <div className="grid grid-cols-2 gap-4 w-full">
        <QuickAction icon={FileEdit} label="Create" />
        <QuickAction icon={Search} label="Explore" />
        <QuickAction icon={Code} label="Code" />
        <QuickAction icon={BookOpen} label="Learn" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        {[
          "How does AI work?",
          "Are black holes real?",
          'How many Rs are in the word "strawberry"?',
          "What is the meaning of life?",
        ].map((question, index) => (
          <button
            key={index}
            className="text-left px-4 py-3 rounded-lg bg-card hover:bg-accent/50 border border-border text-foreground transition-all duration-300"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
