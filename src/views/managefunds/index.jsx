// Chakra imports
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Input,
  Text,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
// Custom components
import Card from "components/card/Card.js";
import CustomAlert from "components/alert/alert";

import ComplexTable from "views/components/ComplexTable";
import { api } from "constant";
import {
  walletLaneContract,
  usdcContract,
  USDC_DECIMALS,
  roundValue,
} from "constant";
import { ethers } from "ethers";
import { splitSignature } from "ethers/lib/utils";

export default function Marketplace() {
  let [balance, setBalance] = useState(0);
  let [bill, setBill] = useState(0);
  let [amount, setAmount] = useState(0);
  let [alertStatus, setAlertStatus] = useState("success");
  let [alertMessage, setAlertMessage] = useState("");
  let [alertTitle, setAlertTitle] = useState("");
  let [alertShow, setAlertShow] = useState(false);
  const [tableDataComplex, setTableDataComplex] = useState([]);

  useEffect(() => {
    let fetchData = async () => {
      let data = await api("GET", "/api/funds/", {});
      setBalance(data.balance);
      setBill(data.bill);
      let fund = data.fund.map((item) => {
        let modifiedItem = { ...item };
        modifiedItem.amount = roundValue(item.amount);
        return fund
      });
      setTableDataComplex(fund);
    };
    fetchData();
  }, []);

  const deposit = async () => {
    let usdc = usdcContract();
    let walletLane = walletLaneContract();
    let value = ethers.utils.parseUnits(amount, USDC_DECIMALS);
    let tx = await usdc.approve(walletLane.address, value);
    await tx.wait();
    tx = await walletLane.deposit(value);
    await tx.wait();
    let res = await api("POST", "/api/funds/", {
      amount: String(value),
      type: "Deposit",
      link: `https://goerli.arbiscan.io/${tx.hash}`,
    });
    if (res.result) {
      setAlertMessage("Deposit success");
      setAlertTitle("Success");
      setAlertStatus("success");
      setAlertShow(true);
    } else {
      setAlertMessage("Deposit failed");
      setAlertTitle("Failed");
      setAlertStatus("error");
      setAlertShow(true);
    }
  };

  const columnsDataComplex = [
    {
      Header: "TYPE",
      accessor: "type",
    },
    {
      Header: "AMOUNT",
      accessor: "amount",
    },
    {
      Header: "DATE",
      accessor: "date",
    },
    {
      Header: "LINK",
      accessor: "link",
    },
    {
      Header: "STATUS",
      accessor: "status",
    },
  ];

  const withdraw = async () => {
    let value = ethers.utils.parseUnits(amount, USDC_DECIMALS);
    let res = await api("POST", "/api/withdraw/", {
      amount: String(value),
    });
    if (res.result) {
      let { r, s, v } = splitSignature(res.signature);
      let walletLane = walletLaneContract();
      let tx = await walletLane.withdraw(value, v, r, s);
      await tx.wait();

      res = await api("POST", "/api/funds/", {
        amount: String(value),
        type: "Withdraw",
        link: `https://etherscan.io/tx/${tx.hash}`,
      });
      console.log(res);
      setAlertMessage("Withdraw success");
      setAlertTitle("Success");
      setAlertStatus("success");
      setAlertShow(true);
    } else {
      res = await api("POST", "/api/funds/", {
        amount: String(value),
        type: "Withdraw",
        link: "",
        status: "Rejected",
      });
      console.log(res);
      setAlertMessage("Withdraw failed");
      setAlertTitle("Failed");
      setAlertStatus("error");
      setAlertShow(true);
    }
  };

  const billPay = async () => {
    let value = ethers.utils.parseUnits(String(bill), USDC_DECIMALS);
    let res = await api("POST", "/api/billpay/", {
      amount: String(value),
    });
    let { r, s, v } = splitSignature(res.signature);
    let tx = await walletLaneContract().pay(value, v, r, s);
    await tx.wait();
    res = await api("POST", "/api/funds/", {
      amount: String(value),
      type: "Bill Payment",
      link: `https://etherscan.io/tx/${tx.hash}`,
    });
    console.log(res);
    setAlertMessage("Bill pay success");
    setAlertTitle("Success");
    setAlertStatus("success");
    setAlertShow(true);
  };

  const trustlessWtihdraw = async () => {
    let value = ethers.utils.parseUnits(String(bill), USDC_DECIMALS);
    let tx = await walletLaneContract().trustlessWithdraw(value, {
      value: ethers.utils.parseUnits("0.001", 18),
    });
    await tx.wait();
    await api("POST", "/api/funds/", {
      amount: String(value),
      type: "Trustless Withdraw",
      link: `https://etherscan.io/tx/${tx.hash}`,
      status: "Pending",
    });
  };
  // Chakra Color Mode
  const redColor = useColorModeValue("red.500", "red");
  const redColorDark = useColorModeValue("red.700", "red");
  const blueColor = useColorModeValue("blue.400", "blue");
  const blueColorDark = useColorModeValue("blue.700", "blue");
  const greenColor = useColorModeValue("green.500", "green");
  const greenColorDark = useColorModeValue("green.700", "green");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {alertShow && (
        <CustomAlert
          status={alertStatus}
          title={alertTitle}
          description={alertMessage}
          isVisible={alertShow}
          onClose={() => {
            setAlertShow(false);
          }}
        />
      )}
      <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} gap='20px' mb='20px'>
        <Flex flexDirection={{ base: "column", md: "row" }} gap='20px'>
          <Card px='0px' mb={{ base: "20px", md: "0" }} flex='1'>
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              gap={"20px"}
              padding={"20px"}
            >
              <Box
                flex='1'
                display='flex'
                alignItems='center'
                flexDirection={"column"}
              >
                <Text fontSize='lg' fontWeight='bold'>
                  {roundValue(balance)} USDC
                </Text>
                <Text fontSize='sm' color={"gray.500"}>
                  Available Balance
                </Text>
                <Input
                  placeholder='Amount'
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </Box>
              <Box flex='1'>
                <Button
                  textColor={"white"}
                  backgroundColor={greenColor}
                  _hover={{ bg: greenColorDark }}
                  mb={2} // Add margin-bottom for spacing between buttons
                  mr={2}
                  w='48%' // Make the button full width
                  onClick={deposit}
                >
                  Deposit
                </Button>
                <Button
                  textColor={"white"}
                  backgroundColor={redColor}
                  _hover={{ bg: redColorDark }}
                  mb={2} // Add margin-bottom for spacing between buttons
                  w='48%' // Make the button full width
                  onClick={withdraw}
                >
                  Withdraw
                </Button>
                <Button
                  textColor={"white"}
                  backgroundColor={blueColor}
                  _hover={{ bg: blueColorDark }}
                  w='100%' // Make the button full width
                  onClick={trustlessWtihdraw}
                >
                  Trustless Withdraw
                </Button>
              </Box>
            </Flex>
          </Card>
          <Card
            px='0px'
            mb={{ base: "20px", md: "0" }}
            flex='1'
            display='flex'
            flexDirection='column'
            justifyContent='center'
          >
            <Flex
              padding={"20px"}
              alignItems={"center"}
              justifyContent='center'
            >
              <Box textAlign='center' flex={1}>
                <Text fontSize='lg' fontWeight='bold'>
                  {roundValue(bill)} USDC
                </Text>
                <Text fontSize='sm' color={"gray.500"}>
                  Your bill
                </Text>
              </Box>
              <Box textAlign='center' flex={1}>
                <Button
                  w='100%'
                  backgroundColor={greenColor}
                  textColor={"white"}
                  _hover={{ bg: greenColorDark }}
                  onClick={billPay}
                >
                  Pay Bill
                </Button>
              </Box>
            </Flex>
          </Card>
        </Flex>
      </SimpleGrid>
      <SimpleGrid
        columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
        gap='20px'
        mb='20px'
      >
        <Flex flexDirection='column'>
          <Card px='0px' mb='20px'>
            <ComplexTable
              columnsData={columnsDataComplex}
              tableData={tableDataComplex}
              name='History'
            />
          </Card>
        </Flex>
      </SimpleGrid>
    </Box>
  );
}
