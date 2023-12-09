import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function CustomAlert(props) {
  const [isVisible, setIsVisible] = useState(props.isVisible);
  useEffect(() => {
    setIsVisible(props.isVisible);
  }, [props]);
  return isVisible ? (
    <Alert status={props.status} mb={'20px'}>
      <AlertIcon />
      <Box>
        <AlertTitle>{props.title}</AlertTitle>
        <AlertDescription>{props.description}</AlertDescription>
      </Box>
      <CloseButton
        alignSelf='flex-start'
        position='relative'
        right={-1}
        top={-1}
        ml={'auto'}
        onClick={() => {
          setIsVisible(false);
          props.onClose();
        }}
      />
    </Alert>
  ) : (
    <></>
  );
}
export default CustomAlert;
