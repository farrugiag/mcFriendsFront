import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import {
  Button,
  Icon,
  Box,
  HStack,
  Avatar,
  Heading,
  Link,
  View,
  Modal,
  Stack,
  Input,
  useSafeArea,
} from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { HOST } from "@env";
import { connect } from "react-redux";

const MessageScreen = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [usersSearch, setUsersSearch] = useState([]);
  const [listConversation, setListConversation] = useState([]);
  // console.log(">>listConversation", listConversation);
  // console.log(">>usersSearch", usersSearch);

  useEffect(() => {
    const requestConversation = async () => {
      const rawConversation = await fetch(`${HOST}/recherche-conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}`,
      });
      const conversation = await rawConversation.json();
      console.log(">>conversation", conversation);
      setListConversation(conversation.messages);
    };
    requestConversation();
  }, []);

  const handleGoChat = (userToken) => {
    // console.log(">>userToken", userToken);
    props.navigation.navigate("chat"),
      {
        token: userToken,
      };
  };

  const handleSearch = async () => {
    const sendUserSearch = await fetch(
      `${HOST}/recherche-utilisateur-message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `nameSearch=${search}`,
      }
    );
    const userSearch = await sendUserSearch.json();
    setUsersSearch(userSearch.userData);
  };

  const handleModal = (userToken) => {
    props.navigation.navigate("chat", {
      token: userToken,
    });
    setShowModal(false);
    setSearch("");
    setUsersSearch([]);
  };

  const listConversationItem = listConversation.map((message, i) => {
    const userToken = message.token;
    // console.log(">>userToken", userToken);

    return (
      <Link key={i} onPress={() => handleGoChat(userToken)}>
        <HStack width="100%" px={4} my={4}>
          <HStack space={2} alignItems="center">
            <Avatar color="white" bg={"secondary.700"}>
              GF
            </Avatar>
            <Heading size="sm">{message.user}</Heading>
          </HStack>
        </HStack>
      </Link>
    );
  });

  const affichageRecherche = usersSearch.map((user, i) => {
    // console.log(">>user.token", user);
    const userToken = user.token;
    // console.log(">>userToken", userToken);
    return (
      <Link key={i} onPress={() => handleModal(userToken)}>
        <HStack width="100%" px={4} my={4}>
          <HStack space={2} alignItems="center">
            <Avatar color="white" bg={"secondary.700"}>
              GF
            </Avatar>
            <Heading size="sm">{user.nom}</Heading>
          </HStack>
        </HStack>
      </Link>
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: "#62ADEB" }} />
      <Box
        p={4}
        _text={{
          fontSize: "md",
          fontWeight: "bold",
          color: "white",
        }}
        alignItems="center"
        mb={3}
        bg="#62ADEB"
      >
        Messagerie
      </Box>
      {listConversationItem}
      <Stack justifyContent="flex-end" alignItems="flex-end">
        <Button
          bg="#62ADEB"
          width="15%"
          onPress={() => setShowModal(true)}
          startIcon={
            <Icon color="white" as={<AntDesign name="plus" />} size="sm" />
          }
        ></Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="100%">
            <Modal.Header>
              <View style={{ flexDirection: "row" }}>
                <Input
                  onChangeText={(value) => setSearch(value)}
                  value={search}
                  placeholder="Recherche utilisateur"
                  variant="filled"
                  width="100%"
                  bg="gray.200"
                  borderRadius={10}
                  py={1}
                  px={2}
                  _web={{
                    _focus: {
                      borderColor: "muted.300",
                      style: { boxShadow: "none" },
                    },
                  }}
                  InputLeftElement={
                    <Icon
                      size="sm"
                      ml={2}
                      size={5}
                      color="gray.400"
                      as={<Ionicons name="ios-search" />}
                    />
                  }
                  InputRightElement={
                    <Icon
                      size="sm"
                      ml={2}
                      size={10}
                      color="black"
                      as={<Ionicons name="ios-enter" />}
                      onPress={() => handleSearch()}
                    />
                  }
                />
              </View>
            </Modal.Header>
            <Modal.Body>{affichageRecherche}</Modal.Body>
          </Modal.Content>
        </Modal>
      </Stack>
    </View>
  );
};
function mapStateToProps(state) {
  return { token: state.token };
}
export default connect(mapStateToProps, null)(MessageScreen);
