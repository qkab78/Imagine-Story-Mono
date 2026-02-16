/** @type {import('@bacons/apple-targets').Config} */
module.exports = (config) => ({
  type: "widget",
  name: "ImagineStoryWidget",
  displayName: "Imagine Story",
  icon: "../../assets/images/icon.png",
  frameworks: ["SwiftUI", "WidgetKit"],
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
  },
});
