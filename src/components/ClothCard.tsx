import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Title, Badge, useTheme } from "react-native-paper";

interface ClothCardProps {
  image: string;
  name: string;
  type: "Eastern" | "Western";
  category: "Upper Body" | "Lower Body";
}

const ClothCard: React.FC<ClothCardProps> = ({ image, name, type, category }) => {
  const theme = useTheme();
  
  // Badge color mapping for consistency
  const badgeColors = {
    type: {
      Eastern: theme.colors.primary,
      Western: theme.colors.secondary
    },
    category: {
      "Upper Body": theme.colors.tertiary,
      "Lower Body": theme.colors.error
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Cover 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <Card.Content style={styles.contentContainer}>
        <Title 
          style={styles.title} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {name}
        </Title>
        
        <View style={styles.badgesContainer}>
          <Badge
            style={[
              styles.badge,
              styles.typeBadge,
              { backgroundColor: badgeColors.type[type] }
            ]}
          >
            {type}
          </Badge>
          
          <Badge
            style={[
              styles.badge,
              styles.categoryBadge,
              { backgroundColor: badgeColors.category[category] }
            ]}
          >
            {category}
          </Badge>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    borderRadius: 12,
    elevation: 4,
    margin: 8,
    overflow: "hidden",
  },
  image: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  badge: {
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
    height: 24,
    color: "white",
  },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
  },
});

export default ClothCard;
