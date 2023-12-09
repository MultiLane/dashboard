// Chakra imports
import { Button, Flex, Text, Box } from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import SwitchField from "components/fields/SwitchField";
import { blueColor, blueColorDark, textColorPrimary } from "views/color";

export default function Notifications(props) {
  let { ...rest } = props;
  delete rest.allowAllAddress;
  delete rest.handleAllowAllAddress;
  delete rest.handleAllowAllDomain;
  delete rest.allowAllDomain;

  // Chakra Color Mode

  return (
    <Card mb='20px' mx='auto' {...rest}>
      <Flex align='center' w='100%' justify='space-between' mb='30px'>
        <Text
          color={textColorPrimary}
          fontWeight='bold'
          fontSize='2xl'
          mb='4px'
        >
          Configurations
        </Text>
      </Flex>
      <SwitchField
        isChecked={props.allowAllAddress}
        reversed={false}
        onChange={(e) => {
          props.handleAllowAllAddress(e.target.checked);
        }}
        fontSize='sm'
        mb='20px'
        id='1'
        label='Allow all addresses'
      />
      <SwitchField
        isChecked={props.allowAllDomain}
        reversed={false}
        onChange={(e) => {
          props.handleAllowAllDomain(e.target.checked);
        }}
        fontSize='sm'
        mb='20px'
        id='1'
        label='Allow all websites'
      />
    </Card>
  );
}
