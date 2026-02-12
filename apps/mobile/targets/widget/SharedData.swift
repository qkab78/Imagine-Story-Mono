import Foundation

/// Story data shared between the React Native app and the widget via App Groups UserDefaults.
struct WidgetStory: Codable, Identifiable {
    let id: String
    let title: String
    let synopsis: String
    let themeKey: String
    let themeName: String
    let numberOfChapters: Int
}

/// Reads stories from shared UserDefaults (App Groups).
struct SharedDataStore {
    static let groupIdentifier = "group.com.qkab78.mobile.widget"
    static let storiesKey = "stories"

    static func loadStories() -> [WidgetStory] {
        guard let defaults = UserDefaults(suiteName: groupIdentifier),
              let jsonString = defaults.string(forKey: storiesKey),
              let data = jsonString.data(using: .utf8) else {
            return []
        }

        do {
            return try JSONDecoder().decode([WidgetStory].self, from: data)
        } catch {
            return []
        }
    }

    /// Returns the first story or a placeholder.
    static func firstStory() -> WidgetStory {
        return loadStories().first ?? placeholderStory
    }

    static let placeholderStory = WidgetStory(
        id: "placeholder",
        title: "Imagine Story",
        synopsis: "Ouvre l'app pour découvrir des histoires magiques...",
        themeKey: "magic",
        themeName: "Magie",
        numberOfChapters: 0
    )
}
