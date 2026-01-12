import { create } from "zustand";
import { Story } from "@/domain/stories/entities/Story";
import { StoryCreationFormData } from "@/types/creation";

export type StoryStore = {
  activeStory?: Story;
  setActiveStory: (story?: Story) => void;
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
