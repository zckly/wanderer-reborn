import { useState } from "react";
import { Dices, EllipsisVertical } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@acme/ui/button";
import { Label } from "@acme/ui/label";
import { ScrollArea } from "@acme/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@acme/ui/sheet";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import type { AppState } from "~/hooks/store-types";
import useStore from "~/hooks/useStore";
import { sampleValues } from "./sampleValues";

const selector = (state: AppState) => ({
  workSituation: state.workSituation,
  setWorkSituation: state.setWorkSituation,
  livingSituation: state.livingSituation,
  setLivingSituation: state.setLivingSituation,
  friendsAndFamilySituation: state.friendsAndFamilySituation,
  setFriendsAndFamilySituation: state.setFriendsAndFamilySituation,
  interests: state.interests,
  setInterests: state.setInterests,
});

export const SettingsSheet = ({
  workSituation,
  livingSituation,
  friendsAndFamily,
  interests,
}: {
  workSituation: string;
  livingSituation: string;
  friendsAndFamily: string;
  interests: string;
}) => {
  const {
    setWorkSituation,
    setLivingSituation,
    setFriendsAndFamilySituation,
    setInterests,
  } = useStore(useShallow(selector));

  const [workSituationInput, setWorkSituationInput] = useState(workSituation);
  const [livingSituationInput, setLivingSituationInput] =
    useState(livingSituation);
  const [friendsAndFamilyInput, setFriendsAndFamilyInput] =
    useState(friendsAndFamily);
  const [interestsInput, setInterestsInput] = useState(interests);

  function handleSave() {
    setWorkSituation(workSituationInput);
    setLivingSituation(livingSituationInput);
    setFriendsAndFamilySituation(friendsAndFamilyInput);
    setInterests(interestsInput);
    toast.success("Settings saved");
  }
  function handleRandomize() {
    const randomIndex = Math.floor(Math.random() * sampleValues.length);
    const randomSample = { ...sampleValues[randomIndex] }; // Create a new object to ensure it's a different reference
    console.log(randomSample);

    setWorkSituationInput(randomSample.workSituation ?? "");
    setLivingSituationInput(randomSample.livingSituation ?? "");
    setFriendsAndFamilyInput(randomSample.friendsAndFamily ?? "");
    setInterestsInput(randomSample.interests ?? "");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="absolute right-4 top-4">
          <Button size="icon" variant="ghost">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col p-0 font-mono">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Edit your background</SheetTitle>
          <button
            className="flex flex-row items-center gap-2 text-sm hover:underline"
            onClick={handleRandomize}
          >
            <Dices className="h-4 w-4" />
            Generate random values
          </button>
        </SheetHeader>
        <ScrollArea className="grow p-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label className="font-semibold">Work situation</Label>
              <Textarea
                value={workSituationInput}
                onChange={(e) => setWorkSituationInput(e.target.value)}
                className="h-[100px] text-xs"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label className="font-semibold">Living situation</Label>
              <Textarea
                value={livingSituationInput}
                onChange={(e) => setLivingSituationInput(e.target.value)}
                className="h-[100px] text-xs"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label className="font-semibold">
                Friends, family, relationships
              </Label>
              <Textarea
                value={friendsAndFamilyInput}
                onChange={(e) => setFriendsAndFamilyInput(e.target.value)}
                className="h-[100px] text-xs"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label className="font-semibold">Interests & hobbies</Label>
              <Textarea
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                className="h-[100px] text-xs"
              />
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="flex justify-end p-4 pt-0">
          <Button onClick={handleSave}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
