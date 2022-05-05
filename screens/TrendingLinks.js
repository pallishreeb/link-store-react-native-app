import React, { useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Text,
} from "react-native";
import { AuthContext } from "../context/auth";
import FooterTabs from "../components/FooterTabs";
import { LinkContext } from "../context/link";
import axios from "axios";
import PreviewCard from "../components/PreviewCard";

const TrendingLinks = ({ navigation }) => {
  const { state, setState } = useContext(AuthContext);
  const [links, setLinks] = useContext(LinkContext);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data } = await axios.get("/links");
    setLinks(data);
  };

  const handlePress = async (link) => {
    await axios.put(`/view-count/${link._id}`);
    navigation.navigate("LinkView", { link });
    // update link in the context
    setLinks(() => {
      const index = links.findIndex((l) => l._id === link._id);
      links[index] = { ...link, views: link.views + 1 };
      return [...links];
    });
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/trending.jpeg")}
      style={{ flex: 1, height: "100%" }}
    >
      <Text
        style={{
          color: "#fff",
          paddingTop: 10,
          paddingBottom: 30,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        Trending Links
      </Text>

      <RenderLinks
        links={
          links &&
          links.sort((a, b) => (a.views < b.views ? 1 : -1)).slice(0, 3)
        }
        handlePress={handlePress}
      />

      <Text
        style={{
          color: "#fff",
          marginTop: -30,
          paddingBottom: 20,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        Latest Links
      </Text>

      <RenderLinks
        links={
          links &&
          links.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3)
        }
        handlePress={handlePress}
      />

      <FooterTabs />
    </ImageBackground>
  );
};

const RenderLinks = ({ links, handlePress }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {links.map((link) => (
      <View
        key={link._id}
        style={{
          alignItems: "center",
          width: 400,
          height: 300,
        }}
      >
        <PreviewCard
          {...link.urlPreview}
          handlePress={handlePress}
          link={link}
          showIcons={true}
        />
      </View>
    ))}
  </ScrollView>
);

export default TrendingLinks;
