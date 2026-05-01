import { Ionicons } from '@expo/vector-icons';
import { visualSystemTokens } from '@funcup/shared';
import { Text, View } from 'react-native';

const { recipes, spacing, radius } = visualSystemTokens;

export function TabDotIcon(props: { active: boolean; label: string }) {
  return (
    <View
      style={{
        width: props.active ? 26 : 22,
        height: props.active ? 26 : 22,
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: props.active ? recipes.tabbar.activeIcon : recipes.tabbar.inactiveIcon,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.active ? visualSystemTokens.colors.surface : 'transparent',
      }}
    >
      <Text style={{ fontSize: 11, color: props.active ? recipes.tabbar.activeIcon : recipes.tabbar.inactiveIcon }}>
        {props.label}
      </Text>
    </View>
  );
}

export function TabCentralScanFab() {
  return (
    <View
      style={{
        width: 84,
        height: 84,
        borderRadius: radius.pill,
        marginTop: -58,
        backgroundColor: recipes.tabbar.fabBackground,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: recipes.tabbar.background,
      }}
    >
      <Ionicons name="qr-code-outline" size={28} color={recipes.tabbar.fabIcon} />
    </View>
  );
}

export const tabBarScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: recipes.tabbar.activeIcon,
  tabBarInactiveTintColor: recipes.tabbar.inactiveIcon,
  tabBarStyle: {
    height: 84,
    paddingBottom: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: recipes.tabbar.borderTopColor,
    backgroundColor: recipes.tabbar.background,
  },
} as const;
