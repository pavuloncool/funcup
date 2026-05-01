import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { getLearnArticleBySlug } from '../../src/content/learn/articles';
import { AppScrollScreen, AppText } from '../../src/components/ui/primitives';

export default function LearnArticleScreen() {
  const params = useLocalSearchParams<{ slug?: string }>();
  const article = getLearnArticleBySlug(params.slug ?? '');

  if (!article) {
    return (
      <AppScrollScreen contentContainerStyle={styles.page}>
        <AppText variant="h2" weight="700">Article not found</AppText>
        <AppText>Try opening the article from Learn tab again.</AppText>
      </AppScrollScreen>
    );
  }

  return (
    <AppScrollScreen contentContainerStyle={styles.page}>
      <AppText variant="h1" weight="700">{article.title}</AppText>
      <AppText>{article.body}</AppText>
    </AppScrollScreen>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 12 },
});
