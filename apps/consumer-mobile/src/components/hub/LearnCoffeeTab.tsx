import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { learnArticles } from '../../content/learn/articles';
import { EmptyState } from '../EmptyState';

import { discoverHubStyles } from './discoverHub.styles';

export function LearnCoffeeTab() {
  if (learnArticles.length === 0) {
    return (
      <EmptyState
        title="No articles yet"
        description="Learning content will show up here when it is published."
      />
    );
  }

  return (
    <View style={discoverHubStyles.list}>
      {learnArticles.map((article) => (
        <View key={article.slug} style={discoverHubStyles.card}>
          <Text style={discoverHubStyles.title}>{article.title}</Text>
          <Text>{article.excerpt}</Text>
          <Link href={{ pathname: '/learn/[slug]', params: { slug: article.slug } }}>Read article</Link>
        </View>
      ))}
    </View>
  );
}
