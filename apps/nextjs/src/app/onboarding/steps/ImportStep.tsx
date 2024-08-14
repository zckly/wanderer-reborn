"use client";

import { useState } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

import { Button } from "@acme/ui/button";
import { DialogFooter } from "@acme/ui/dialog";

import type { OnboardingState } from "~/hooks/store-types";
import Spinner from "~/components/Spinner";
import useOnboardingStore from "~/hooks/useOnboardingStore";
import { api } from "~/trpc/react";
import OnboardingHeader from "../OnboardingHeader";

const selector = (state: OnboardingState) => ({
  onboardingStep: state.onboardingStep,
  setOnboardingStep: state.setOnboardingStep,
  setCurrentRole: state.setCurrentRole,
  setEduHistory: state.setEduHistory,
  setWorkHistory: state.setWorkHistory,
});
const bodyVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

export default function ImportPage() {
  const {
    onboardingStep,
    setOnboardingStep,
    setCurrentRole,
    setEduHistory,
    setWorkHistory,
  } = useOnboardingStore(selector);
  const [linkedinUsername, setLinkedinUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = api.onboarding.getLinkedinProfile.useMutation();

  const handleLinkedinUsernameSubmit = async () => {
    setLoading(true);
    try {
      const cleanUsername = linkedinUsername
        .replace("linkedin.com", "")
        .replace("in/", "")
        .replaceAll("/", "");
      // Placeholder for API call and data processing

      // const profile = await mutateAsync({ username: cleanUsername });
      // console.log({ profile });
      // setCurrentRole(profile.occupation);

      // const eduHistory = profile.education.map((e) => {
      //   // Degree, school, duration
      //   // Calculate duration with date-fns. E.g. 13 months, 2 years, etc.
      //   let duration = "";
      //   if (e.starts_at?.year && e.starts_at?.month && e.starts_at?.day) {
      //     duration = formatDistance(
      //       new Date(
      //         e.starts_at?.year,
      //         e.starts_at?.month - 1,
      //         e.starts_at?.day,
      //       ),
      //       new Date(
      //         e.ends_at?.year ?? new Date().getFullYear(),
      //         (e.ends_at?.month ?? 0) - 1 ?? new Date().getMonth(),
      //         e.ends_at?.day ?? new Date().getDate(),
      //       ),
      //       { addSuffix: false },
      //     );
      //   }
      //   return {
      //     degree: e.degree_name,
      //     fieldOfStudy: e.field_of_study,
      //     school: e.school,
      //     duration,
      //   };
      // });
      // setEducationHistory(eduHistory);
      // const workHistory = profile.experiences.map((e) => {
      //   // Title, company, duration
      //   // Calculate duration with date-fns. E.g. 13 months, 2 years, etc.
      //   let duration = "";
      //   if (e.starts_at?.year && e.starts_at?.month && e.starts_at?.day) {
      //     duration = formatDistance(
      //       new Date(
      //         e.starts_at?.year,
      //         e.starts_at?.month - 1,
      //         e.starts_at?.day,
      //       ),
      //       new Date(
      //         e.ends_at?.year ?? new Date().getFullYear(),
      //         (e.ends_at?.month ?? 0) - 1 ?? new Date().getMonth(),
      //         e.ends_at?.day ?? new Date().getDate(),
      //       ),
      //       { addSuffix: false },
      //     );
      //   }
      //   return {
      //     title: e.title,
      //     company: e.company,
      //     duration,
      //   };
      // });
      // setWorkHistory(workHistory);
      setOnboardingStep(onboardingStep + 1);
    } catch (error) {
      console.error("Error processing LinkedIn profile:", error);
      setLoading(false);
    }
  };

  const isDisabled = loading || !linkedinUsername;

  return (
    <>
      <OnboardingHeader
        title="Load your background and experience from Linkedin"
        description="We'll use this to understand your skills, experience, and background."
      />
      <DialogFooter className="items-end">
        <motion.div
          className="mt-4 flex w-full flex-col gap-y-4 py-2"
          variants={bodyVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center rounded-full border border-gray-300 bg-white p-1">
            <span className="ml-4 text-sm text-gray-600">linkedin.com/in/</span>
            <input
              className="flex-1 bg-transparent text-sm text-black placeholder-gray-400 outline-none"
              placeholder="username"
              type="text"
              value={linkedinUsername}
              onChange={(e) =>
                setLinkedinUsername(
                  e.target.value
                    .split("linkedin.com/in/")
                    .pop()
                    ?.replaceAll("/", "") ?? "",
                )
              }
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                void handleLinkedinUsernameSubmit();
              }}
              disabled={isDisabled}
              variant="ghost"
              className="rounded-full text-black hover:bg-gray-100 disabled:text-gray-400"
            >
              {loading ? (
                <Spinner size={14} />
              ) : (
                <PaperPlaneIcon className="h-3 w-3" />
              )}
            </Button>
          </div>
        </motion.div>
      </DialogFooter>
    </>
  );
}
