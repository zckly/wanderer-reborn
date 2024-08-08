import { GithubIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import type { OnboardingState } from "~/hooks/store-types";
import useOnboardingStore from "~/hooks/useOnboardingStore";
import FractalSphereAnimation from "./FractalSphereAnimation";
import SignupStep from "./SignupStep";

const selector = (state: OnboardingState) => ({
  onboardingStep: state.onboardingStep,
  setOnboardingStep: state.setOnboardingStep,
});

export function OnboardingDialog({ open }: { open: boolean }) {
  const { onboardingStep, setOnboardingStep } = useOnboardingStore(
    useShallow(selector),
  );

  const handleGetStarted = () => {
    setOnboardingStep(1);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        hideCloseIcon
        className="w-full font-mono sm:max-w-[480px] md:max-w-[640px]"
      >
        {onboardingStep === 0 ? (
          <>
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
                <Button onClick={handleGetStarted}>Get started</Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <SignupStep />
        )}
      </DialogContent>
    </Dialog>
  );
}
