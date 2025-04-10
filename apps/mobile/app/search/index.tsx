
import { getSuggestedStories } from "@/api/stories";
import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import useAuthStore from "@/store/auth/authStore";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, SearchIcon } from "lucide-react-native";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Image } from "tamagui";
import { Link, router } from "expo-router";
import { theme } from "@/config/theme";

const { width, height } = Dimensions.get('window');

const HEADER_HEIGHT = height * 0.07;
const SEARCH_INPUT_HEIGHT = height * 0.04;
const SEARCH_INPUT_WIDTH = width * 0.8;
const ICON_SIZE = 24;
const IMAGE_WIDTH = width * 0.4;
const IMAGE_HEIGHT = width * 0.3;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    color: "black"
  },
  container: {
    marginTop: HEADER_HEIGHT,
    width
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.black,
  }
})

const Search = () => {
  const token = useAuthStore(state => state.token);
  const [searchQuery, setSearchQuery] = useState("");
  const shouldRefetchQuery = searchQuery.length > 2;

  const { data: searchSuggestions, isLoading: isSearchSuggestionsLoading, isError: isSearchSuggestionsError } = useQuery({
    queryKey: ["suggestedStories", token],
    queryFn: () => getSuggestedStories(token!, searchQuery),
    enabled: shouldRefetchQuery,
  })


  return (
    <Box flex={1} justifyContent="flex-start" alignItems="center" marginHorizontal={"s"} gap={"m"} style={styles.container}>
      <Box flexDirection={"row"} justifyContent="flex-start" alignItems="center" width={width} height={SEARCH_INPUT_HEIGHT}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={ICON_SIZE} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <Box flexDirection={"row"} gap={"s"} alignItems="center" width={SEARCH_INPUT_WIDTH} borderColor="black" borderWidth={1} borderRadius={"s"} paddingHorizontal={"s"} height={SEARCH_INPUT_HEIGHT}>
          <SearchIcon size={16} color="black" />
          <TextInput
            placeholder="Rechercher des histoires..."
            underlineColorAndroid="transparent"
            placeholderTextColor="black"
            style={styles.searchInput}
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
        </Box>
      </Box>


      <Box flex={1} width={width} justifyContent="flex-start" paddingHorizontal={"s"} gap={"l"}>
        <Text variant="subTitle">Histoires suggérées</Text>
        {isSearchSuggestionsLoading && <ActivityIndicator size="large" color="black" />}
        {isSearchSuggestionsError && <Text>Error fetching stories</Text>}
        {shouldRefetchQuery && !searchSuggestions && <Text>Aucune histoire trouvée</Text>}
        {searchSuggestions && (
          <FlatList
            data={searchSuggestions}
            renderItem={({ item }) => (
              <Link href={`/search/stories/${item.slug}`} asChild>
                <TouchableOpacity style={{ marginBottom: 10 }}>
                  <Box flexDirection={"row"} alignItems="center" gap={"s"}>
                    <Image source={{ uri: item.cover_image }} style={styles.image} />
                    <Text variant="body" style={{ flex: 1 }}>{item.title}</Text>
                  </Box>
                </TouchableOpacity>
              </Link>
            )}
          />
        )}
      </Box>
    </Box>
  )
};

export default Search;