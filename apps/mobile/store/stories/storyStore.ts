import { create } from "zustand";
import { Stories } from "@imagine-story/api/types/db";
import { StoryCreationFormData } from "@/types/creation";

export type StoryStore = {
  activeStory?: Stories;
  setActiveStory: (story?: Stories) => void;
  createStoryPayload: StoryCreationFormData | undefined;
  setCreateStoryPayload: (payload: StoryCreationFormData) => void;
  resetCreateStoryPayload: () => void;
};

const useStoryStore = create<StoryStore>((set, get) => ({
  activeStory: undefined,
  setActiveStory: (story) => set({ activeStory: story }),
  createStoryPayload: undefined,
  setCreateStoryPayload: (payload) => set({ createStoryPayload: { ...get().createStoryPayload, ...payload } }),
  resetCreateStoryPayload: () => set({ createStoryPayload: undefined }),
}));

export default useStoryStore;