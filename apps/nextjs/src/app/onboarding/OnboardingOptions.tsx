import { useEffect, useState } from "react";

import { Button } from "@acme/ui/button";

interface OnboardingOptionsProps {
  options: string[];
  multipleChoice?: boolean;
  onSelect: (selectedOptions: string[]) => void;
}

export default function OnboardingOptions({
  options,
  multipleChoice = false,
  onSelect,
}: OnboardingOptionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (option: string) => {
    if (multipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option],
      );
    } else {
      setSelectedOptions([option]);
    }
  };

  useEffect(() => {
    onSelect(selectedOptions);
  }, [selectedOptions, onSelect]);

  return (
    <div className="flex flex-col space-y-2">
      {options.map((option) => (
        <Button
          key={option}
          variant={selectedOptions.includes(option) ? "secondary" : "outline"}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
