import { create } from "zustand";
import { Stories } from "@imagine-story/api/types/db";

export type StoryStore = {
  activeStory?: Stories;
  setActiveStory: (story?: Stories) => void;
};

const useStoryStore = create<StoryStore>((set) => ({
  activeStory: undefined,
  setActiveStory: (story) => set({ activeStory: story }),
}));

export default useStoryStore;