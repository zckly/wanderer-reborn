import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@acme/ui/sheet";
import { Textarea } from "@acme/ui/textarea";

export const BackgroundSheet = ({
  background,
  setBackground,
}: {
  background: string;
  setBackground: (background: string) => void;
}) => {
  const [input, setInput] = useState(background);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="absolute right-4 top-4">
          <Button size="icon" variant="ghost">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change background</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-[300px]"
          />
        </div>
        <SheetFooter>
          <Button
            onClick={() => {
              setBackground(input);
            }}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
