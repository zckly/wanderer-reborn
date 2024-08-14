import Link from "next/link";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@acme/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@acme/ui/dialog";

import type { OnboardingState } from "~/hooks/store-types";
import useOnboardingStore from "~/hooks/useOnboardingStore";
import FractalSphereAnimation from "./FractalSphereAnimation";
import OnboardingHeader from "./OnboardingHeader";

const selector = (state: OnboardingState) => ({
  onboardingStep: state.onboardingStep,
  setOnboardingStep: state.setOnboardingStep,
  setOnboardingCompleted: state.setOnboardingCompleted,
});

export function OnboardingDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { setOnboardingCompleted } = useOnboardingStore(useShallow(selector));

  const handleGetStarted = () => {
    setOnboardingCompleted(true);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        hideCloseIcon
        className="h-[480px] w-full font-mono sm:max-w-[480px] md:max-w-[580px]"
      >
        <>
          <OnboardingHeader
            title="wanderer"
            description="a future life simulator"
          />
          <div className="mx-auto py-0 text-center">
            <FractalSphereAnimation />
          </div>
          <DialogFooter className="items-center !justify-between">
            <div className="flex flex-row gap-1 text-sm">
              <Link
                className="hover:underline"
                href="https://github.com/acme-labs/wanderer"
              >
                about
              </Link>
              <div>/</div>
              <Link
                className="hover:underline"
                href="https://twitter.com/acme_labs"
              >
                github
              </Link>
            </div>
            <div className="flex flex-row gap-2">
              <Button onClick={handleGetStarted}>get started</Button>
            </div>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
