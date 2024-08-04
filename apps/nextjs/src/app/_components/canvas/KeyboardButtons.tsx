import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@acme/ui/button";

export default function KeyboardButtons() {
  return (
    <div className="absolute bottom-4 right-4">
      <div className="flex flex-row items-center gap-2">
        <Button size={"icon"} variant={"outline"} className="no-drag">
          <ArrowLeft size={16} />
        </Button>
        <Button size={"icon"} variant={"outline"} className="no-drag">
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
