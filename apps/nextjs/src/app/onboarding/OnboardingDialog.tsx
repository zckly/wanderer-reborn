import { GithubIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import FractalSphereAnimation from "./FractalSphereAnimation";

export function OnboardingDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogContent className="w-full font-mono sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>wanderer</DialogTitle>
          <DialogDescription>a future life simulator</DialogDescription>
        </DialogHeader>
        <div className="mx-auto py-8 text-center">
          <FractalSphereAnimation />
        </div>
        <DialogFooter className="!justify-between">
          <div>
            <Button variant={"ghost"} size="icon">
              <GithubIcon size={20} />
            </Button>
          </div>
          <div className="flex flex-row gap-2">
            <Button variant="outline">Log in</Button>

            <Button type="submit">Get started</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
