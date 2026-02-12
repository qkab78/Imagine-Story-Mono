import SwiftUI
import WidgetKit

// MARK: - Timeline Provider

struct StoryTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> StoryTimelineEntry {
        StoryTimelineEntry(
            date: Date(),
            story: SharedDataStore.placeholderStory,
            storyIndex: 0,
            totalStories: 1
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (StoryTimelineEntry) -> Void) {
        let stories = SharedDataStore.loadStories()
        let story = stories.first ?? SharedDataStore.placeholderStory
        completion(StoryTimelineEntry(
            date: Date(),
            story: story,
            storyIndex: 0,
            totalStories: max(stories.count, 1)
        ))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StoryTimelineEntry>) -> Void) {
        let stories = SharedDataStore.loadStories()
        let count = max(stories.count, 1)

        var entries: [StoryTimelineEntry] = []
        let now = Date()

        if stories.isEmpty {
            entries.append(StoryTimelineEntry(
                date: now,
                story: SharedDataStore.placeholderStory,
                storyIndex: 0,
                totalStories: 1
            ))
        } else {
            // Create an entry for each story, rotating every 30 minutes
            for (index, story) in stories.prefix(5).enumerated() {
                let entryDate = Calendar.current.date(byAdding: .minute, value: 30 * index, to: now)!
                entries.append(StoryTimelineEntry(
                    date: entryDate,
                    story: story,
                    storyIndex: index,
                    totalStories: min(stories.count, 5)
                ))
            }
        }

        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 3, to: now)!
        completion(Timeline(entries: entries, policy: .after(nextUpdate)))
    }
}

struct StoryTimelineEntry: TimelineEntry {
    let date: Date
    let story: WidgetStory
    let storyIndex: Int
    let totalStories: Int
}

// MARK: - Story of the Day Widget (Medium)

struct StoryOfTheDayWidget: Widget {
    let kind = "StoryOfTheDayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StoryTimelineProvider()) { entry in
            StoryOfTheDayView(entry: entry)
                .containerBackground(for: .widget) {
                    ThemeVisualsMap.visuals(for: entry.story.themeKey).gradient
                }
        }
        .configurationDisplayName("Histoire du Jour")
        .description("Découvre une nouvelle histoire magique chaque jour.")
        .supportedFamilies([.systemMedium])
    }
}

struct StoryOfTheDayView: View {
    let entry: StoryTimelineEntry

    private var theme: ThemeVisuals {
        ThemeVisualsMap.visuals(for: entry.story.themeKey)
    }

    var body: some View {
        ZStack {
            // Floating background emojis
            GeometryReader { geo in
                Text(theme.bgEmoji)
                    .font(.system(size: 40))
                    .opacity(0.08)
                    .position(x: geo.size.width * 0.85, y: geo.size.height * 0.25)

                Text(theme.bgEmoji)
                    .font(.system(size: 28))
                    .opacity(0.06)
                    .position(x: geo.size.width * 0.7, y: geo.size.height * 0.65)

                Text(theme.bgEmoji)
                    .font(.system(size: 20))
                    .opacity(0.04)
                    .position(x: geo.size.width * 0.9, y: geo.size.height * 0.85)
            }

            // Content
            VStack(alignment: .leading, spacing: 0) {
                // Top row: badge + emoji
                HStack(alignment: .top) {
                    // "HISTOIRE DU JOUR" badge
                    HStack(spacing: 4) {
                        Text("📖")
                            .font(.system(size: 10))
                        Text("HISTOIRE DU JOUR")
                            .font(.system(size: 10, weight: .semibold, design: .rounded))
                            .foregroundColor(.white.opacity(0.9))
                            .tracking(0.3)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(.ultraThinMaterial)
                    .clipShape(Capsule())

                    Spacer()

                    Text(theme.emoji)
                        .font(.system(size: 30))
                }

                Spacer()

                // Theme tag
                Text(entry.story.themeName.uppercased())
                    .font(.system(size: 10, weight: .semibold, design: .rounded))
                    .foregroundColor(Color(hex: "#E8D5A0"))
                    .tracking(0.5)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 3)
                    .background(Color(hex: "#E8A838").opacity(0.25))
                    .overlay(
                        RoundedRectangle(cornerRadius: 6)
                            .stroke(Color(hex: "#E8A838").opacity(0.4), lineWidth: 1)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                    .padding(.bottom, 6)

                // Title
                Text(entry.story.title)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .lineLimit(2)
                    .shadow(color: .black.opacity(0.3), radius: 4, y: 2)

                // Synopsis
                Text(entry.story.synopsis)
                    .font(.system(size: 12, weight: .regular, design: .rounded))
                    .foregroundColor(.white.opacity(0.7))
                    .lineLimit(2)
                    .padding(.top, 2)

                // Bottom row: tap hint + dots
                HStack {
                    Text("Tap pour lire →")
                        .font(.system(size: 10, weight: .medium, design: .rounded))
                        .foregroundColor(.white.opacity(0.45))

                    Spacer()

                    // Dot indicators
                    HStack(spacing: 4) {
                        ForEach(0..<entry.totalStories, id: \.self) { i in
                            Capsule()
                                .fill(.white.opacity(i == entry.storyIndex ? 0.8 : 0.25))
                                .frame(width: i == entry.storyIndex ? 14 : 5, height: 5)
                        }
                    }
                }
                .padding(.top, 8)
            }
            .padding(2)
        }
        .widgetURL(URL(string: entry.story.id == "placeholder"
            ? "myapp://home"
            : "myapp://stories/\(entry.story.id)/reader"))
    }
}

// MARK: - Story Small Widget

struct StorySmallWidget: Widget {
    let kind = "StorySmallWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StoryTimelineProvider()) { entry in
            StorySmallView(entry: entry)
                .containerBackground(for: .widget) {
                    ThemeVisualsMap.visuals(for: entry.story.themeKey).gradient
                }
        }
        .configurationDisplayName("Histoire Rapide")
        .description("Un aperçu de l'histoire du jour.")
        .supportedFamilies([.systemSmall])
    }
}

struct StorySmallView: View {
    let entry: StoryTimelineEntry

    private var theme: ThemeVisuals {
        ThemeVisualsMap.visuals(for: entry.story.themeKey)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Top row
            HStack(alignment: .top) {
                Text("Du jour")
                    .font(.system(size: 9, weight: .bold, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
                    .textCase(.uppercase)
                    .tracking(1)

                Spacer()

                Text(theme.emoji)
                    .font(.system(size: 26))
            }

            Spacer()

            // Title
            Text(entry.story.title)
                .font(.system(size: 15, weight: .bold, design: .rounded))
                .foregroundColor(.white)
                .lineLimit(2)
                .shadow(color: .black.opacity(0.3), radius: 3, y: 1)

            // Synopsis
            Text(entry.story.synopsis)
                .font(.system(size: 10, weight: .regular, design: .rounded))
                .foregroundColor(.white.opacity(0.55))
                .lineLimit(2)
                .lineSpacing(1)
                .padding(.top, 3)
        }
        .padding(2)
        .widgetURL(URL(string: entry.story.id == "placeholder"
            ? "myapp://home"
            : "myapp://stories/\(entry.story.id)/reader"))
    }
}

// MARK: - Quick Create Widget (Small)

struct QuickCreateProvider: TimelineProvider {
    func placeholder(in context: Context) -> QuickCreateEntry {
        QuickCreateEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (QuickCreateEntry) -> Void) {
        completion(QuickCreateEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuickCreateEntry>) -> Void) {
        let entry = QuickCreateEntry(date: Date())
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 24, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

struct QuickCreateEntry: TimelineEntry {
    let date: Date
}

struct QuickCreateWidget: Widget {
    let kind = "QuickCreateWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: QuickCreateProvider()) { entry in
            QuickCreateView(entry: entry)
                .containerBackground(for: .widget) {
                    LinearGradient(
                        colors: [Color(hex: "#2E7D4F"), Color(hex: "#1a5a38")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
        }
        .configurationDisplayName("Nouvelle Histoire")
        .description("Crée une nouvelle histoire magique en un tap.")
        .supportedFamilies([.systemSmall])
    }
}

struct QuickCreateView: View {
    let entry: QuickCreateEntry

    var body: some View {
        VStack(spacing: 10) {
            Spacer()

            // Gold "+" button
            ZStack {
                // Glow effect
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [Color(hex: "#E8A838").opacity(0.25), .clear],
                            center: .center,
                            startRadius: 0,
                            endRadius: 50
                        )
                    )
                    .frame(width: 80, height: 80)

                // Button circle
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "#E8A838"), Color(hex: "#F0C060")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 48, height: 48)
                        .shadow(color: Color(hex: "#E8A838").opacity(0.4), radius: 10, y: 4)

                    Text("+")
                        .font(.system(size: 26, weight: .light, design: .rounded))
                        .foregroundColor(.white)
                }
            }

            // Labels
            VStack(spacing: 1) {
                Text("Nouvelle")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("Histoire")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(.white.opacity(0.6))
            }

            Spacer()
        }
        .widgetURL(URL(string: "myapp://stories/creation/welcome"))
    }
}

// MARK: - Previews

#if DEBUG
#Preview("Story of the Day", as: .systemMedium) {
    StoryOfTheDayWidget()
} timeline: {
    StoryTimelineEntry(
        date: Date(),
        story: WidgetStory(
            id: "1",
            title: "Le Renard des Étoiles",
            synopsis: "Dans une forêt où les arbres touchaient la lune, un petit renard roux découvrit que sa queue brillait dans le noir…",
            themeKey: "animals",
            themeName: "Animaux",
            numberOfChapters: 3
        ),
        storyIndex: 0,
        totalStories: 3
    )
}

#Preview("Story Small", as: .systemSmall) {
    StorySmallWidget()
} timeline: {
    StoryTimelineEntry(
        date: Date(),
        story: WidgetStory(
            id: "1",
            title: "Le Renard des Étoiles",
            synopsis: "Dans une forêt où les arbres touchaient la lune, un petit renard roux…",
            themeKey: "animals",
            themeName: "Animaux",
            numberOfChapters: 3
        ),
        storyIndex: 0,
        totalStories: 1
    )
}

#Preview("Quick Create", as: .systemSmall) {
    QuickCreateWidget()
} timeline: {
    QuickCreateEntry(date: Date())
}
#endif
