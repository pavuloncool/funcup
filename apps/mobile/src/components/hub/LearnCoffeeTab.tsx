import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { learnArticles } from '../../content/learn/articles';

export function LearnCoffeeTab() {
  if (learnArticles.length === 0) {
    return <Text>No learning content yet.</Text>;
  }

  return (
    <View style={{ gap: 10 }}>
      {learnArticles.map((article) => (
        <View
          key={article.slug}
          style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, gap: 6 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{article.title}</Text>
          <Text>{article.excerpt}</Text>
          <Link href={{ pathname: '/learn/[slug]', params: { slug: article.slug } }}>Read article</Link>
        </View>
      ))}
    </View>
  );
}
