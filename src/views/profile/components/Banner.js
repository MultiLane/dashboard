// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDownloadDone } from "react-icons/md";

export default function Banner(props) {
  const { banner, avatar, job, posts, followers, following } = props;
  const [edit, setEdit] = useState(false);
  let [name, setName] = useState(props.name);
  useEffect(() => {
    setName(props.name);
  }, [props.name]);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        h='131px'
        w='100%'
      />
      <Avatar
        mx='auto'
        src={avatar}
        h='87px'
        w='87px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
      />

      <Flex align='center' alignSelf={"center"} mt={"20px"}>
        {edit ? (
          <>
            <Input
              size='xl'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                props.onChange(e.target.value);
              }}
            />
            <MdDownloadDone
              size='20px'
              ml='20px'
              onClick={() => {
                setEdit(false);
              }}
            />
          </>
        ) : (
          <>
            {name ? (
              <Text color={textColorPrimary} fontWeight='bold' fontSize='xl'>
                {name} &nbsp;
              </Text>
            ) : (
              <Text
                color={textColorPrimary}
                fontWeight={"bold"}
                fontSize={"xl"}
              >
                Enter your name
              </Text>
            )}

            <CiEdit
              size='20px'
              ml='20px'
              onClick={() => {
                setEdit(true);
              }}
            />
          </>
        )}
      </Flex>

      <Text
        color={textColorSecondary}
        fontSize='sm'
        fontWeight={name ? "" : "bold"}
      >
        {job}
      </Text>
    </Card>
  );
}
