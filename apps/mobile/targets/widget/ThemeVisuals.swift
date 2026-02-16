import SwiftUI

/// Visual properties for each story theme, used to style widget backgrounds.
struct ThemeVisuals {
    let gradientStart: Color
    let gradientEnd: Color
    let emoji: String
    let bgEmoji: String

    var gradient: LinearGradient {
        LinearGradient(
            colors: [gradientStart, gradientEnd],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

/// Maps backend theme keys to visual properties.
enum ThemeVisualsMap {
    static func visuals(for themeKey: String) -> ThemeVisuals {
        switch themeKey {
        case "adventure":
            return ThemeVisuals(
                gradientStart: Color(hex: "#1a2a3a"),
                gradientEnd: Color(hex: "#2d4a6e"),
                emoji: "🏔️",
                bgEmoji: "⚡"
            )
        case "magic":
            return ThemeVisuals(
                gradientStart: Color(hex: "#2a1a3a"),
                gradientEnd: Color(hex: "#5a3d7a"),
                emoji: "🏰",
                bgEmoji: "✨"
            )
        case "animals":
            return ThemeVisuals(
                gradientStart: Color(hex: "#1a3a2a"),
                gradientEnd: Color(hex: "#2E7D4F"),
                emoji: "🦊",
                bgEmoji: "🌿"
            )
        case "mystery":
            return ThemeVisuals(
                gradientStart: Color(hex: "#1a1a2e"),
                gradientEnd: Color(hex: "#3a2a4e"),
                emoji: "🔍",
                bgEmoji: "🌙"
            )
        case "courage":
            return ThemeVisuals(
                gradientStart: Color(hex: "#2e1a1a"),
                gradientEnd: Color(hex: "#6e3a3a"),
                emoji: "🦁",
                bgEmoji: "🔥"
            )
        case "learning":
            return ThemeVisuals(
                gradientStart: Color(hex: "#1a2a3a"),
                gradientEnd: Color(hex: "#2a4a6a"),
                emoji: "📚",
                bgEmoji: "💡"
            )
        case "friendship":
            return ThemeVisuals(
                gradientStart: Color(hex: "#2a1a2e"),
                gradientEnd: Color(hex: "#6a3a5a"),
                emoji: "🤝",
                bgEmoji: "🌈"
            )
        case "family":
            return ThemeVisuals(
                gradientStart: Color(hex: "#2e2a1a"),
                gradientEnd: Color(hex: "#6a5a3a"),
                emoji: "🏡",
                bgEmoji: "❤️"
            )
        default:
            return ThemeVisuals(
                gradientStart: Color(hex: "#1a2a3a"),
                gradientEnd: Color(hex: "#3a5a7a"),
                emoji: "📖",
                bgEmoji: "✨"
            )
        }
    }
}

// MARK: - Color hex extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
