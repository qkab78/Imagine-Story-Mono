// Types pour l'écran profil et les paramètres

export interface IconConfig {
  sfSymbol: string;
  lucide: string;
}

export interface SettingsItemConfig {
  id: string;
  icon: IconConfig;
  label: string;
  value?: string;
  onPress?: () => void;
}

export interface SettingsToggleConfig {
  id: string;
  icon: IconConfig;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export interface SettingsSectionConfig {
  title: string;
  items: (SettingsItemConfig | SettingsToggleConfig)[];
}

export type SettingsItemType = SettingsItemConfig | SettingsToggleConfig;

export const isToggleItem = (item: SettingsItemType): item is SettingsToggleConfig => {
  return 'onValueChange' in item;
};
