import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';

import { getLearnArticleBySlug } from '../../src/content/learn/articles';

export default function LearnArticleScreen() {
  const params = useLocalSearchParams<{ slug?: string }>();
  const article = getLearnArticleBySlug(params.slug ?? '');

  if (!article) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Article not found</Text>
        <Text>Try opening the article from Learn tab again.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>{article.title}</Text>
      <Text>{article.body}</Text>
    </ScrollView>
  );
}
