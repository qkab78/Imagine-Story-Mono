import { AuthStore } from "@/store/auth/authStore";
import { Stories } from "@imagine-story/api/types/db";

export interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  duration: number; // in minutes
  genre: string;
  createdAt: Date;
  isCompleted?: boolean;
  isFavorite?: boolean;
}

export interface HomeScreenProps {
  user: User;
  recentStories: Story[];
  isLoading?: boolean;
  onCreateStory: () => void;
  onReadStories: () => void;
  onStoryPress: (storyId: string) => void;
  onRefresh?: () => void;
}

export interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  iconGradient: string[];
  onPress: () => void;
  testID?: string;
}

export interface StoryItemProps {
  story: Stories;
  onPress: (storySlug: string) => void;
  onLongPress?: (storyId: string) => void;
}

export interface WelcomeHeaderProps {
  user: AuthStore["user"];
}

export interface AgeBadgeProps {
  minAge: number;
  maxAge: number;
}

export interface RecentStoriesSectionProps {
  stories: Stories[];
  onStoryPress: (storySlug: string) => void;
  onStoryLongPress?: (storyId: string) => void;
  isLoading?: boolean;
}