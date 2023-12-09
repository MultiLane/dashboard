// Chakra imports
import { Box, Grid, Button, Text, Input, Flex } from "@chakra-ui/react";

// Custom components
import Banner from "views/profile/components/Banner";
import Notifications from "views/profile/components/Notifications";
import { blueColor, blueColorDark } from "views/color";
import { MdDelete } from "react-icons/md";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import Card from "components/card/Card";
import ComplexTable from "views/components/ComplexTable";
import { greenColor } from "views/color";
import { greenColorDark } from "views/color";
import { useState, useEffect } from "react";
import { textColorPrimary } from "views/color";
import { api } from "constant";
import CustomAlert from "components/alert/alert";

export default function Overview() {
  const [whitelistDomains, setWhitelistDomains] = useState([]);
  const [newDomain, setNewDomain] = useState();
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [chains, setChains] = useState([]);
  const [scwData, setScwData] = useState([]);
  const [whitelistData, setWhitelistData] = useState([]);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertShow, setAlertShow] = useState(false);

  useEffect(() => {
    // Fetch data from API
    let fetchData = async () => {
      let res = await api("GET", "/api/profile/configuration/", {});
      setAddress(res.user_address);
      setName(res.name);
      setAllowAllAddress(res.all_address);
      setAllowAllDomain(res.all_domain);
      setChains(res.chains);
      let tempScwData = [];
      let tempWhitelistData = [];
      for (let i = 0; i < res.chains.length; i++) {
        let temp = {
          chain: res.chains[i].name,
          address: res.scw_address[res.chains[i]?.chain_id],
          chain_id: res.chains[i].chain_id,
        };
        tempScwData.push(temp);
        tempWhitelistData.push({
          chain: res.chains[i].name,
          address: res.address[res.chains[i].chain_id]?.address,
          value: res.address[res.chains[i].chain_id]?.value,
          chain_id: res.chains[i].chain_id,
        });
      }
      setScwData(tempScwData);
      setWhitelistData(tempWhitelistData);
      setWhitelistDomains(res.domain);
    };
    fetchData();
  }, []);

  const scwColumns = [
    {
      Header: "CHAIN",
      accessor: "chain",
    },
    {
      Header: "ADDRESS",
      accessor: "address",
    },
  ];

  const scwInput = {
    ADDRESS: "text",
  };
  const whitelistColumns = [
    {
      Header: "CHAIN",
      accessor: "chain",
    },
    {
      Header: "ADDRESS",
      accessor: "address",
    },
    {
      Header: "VALUE",
      accessor: "value",
    },
  ];

  const whitelistInput = {
    ADDRESS: "text",
    VALUE: "number",
  };

  const [allowAllAddress, setAllowAllAddress] = useState(false);
  const handleAllowAllAddress = (newState) => {
    setAllowAllAddress(newState);
  };
  const [allowAllDomain, setAllowAllDomain] = useState(false);
  const handleAllowAllDomain = (newState) => {
    setAllowAllDomain(newState);
  };

  const save = async () => {
    let data = {};
    data["name"] = name;
    data["all_address"] = allowAllAddress;
    data["all_domain"] = allowAllDomain;
    data["chain"] = [];
    for (let i = 0; i < scwData.length; i++) {
      let temp = {
        chain_id: scwData[i].chain_id,
        address: scwData[i].address,
      };
      data["chain"].push(temp);
    }
    data["domain"] = whitelistDomains;
    data["address"] = [];
    for (let i = 0; i < whitelistData.length; i++) {
      let temp = {
        chain_id: whitelistData[i].chain_id,
        address: whitelistData[i].address,
        value: whitelistData[i].value,
      };
      data["address"].push(temp);
    }
    let res = { result: false };
    try {
      res = await api("POST", "/api/profile/configuration/", data);
    } catch (e) {
      console.error(e);
    }
    if (res.result) {
      setAlertMessage("Configuration saved");
      setAlertTitle("Success");
      setAlertStatus("success");
      setAlertShow(true);
    } else {
      setAlertMessage("Configuration failed");
      setAlertTitle("Failed");
      setAlertStatus("error");
      setAlertShow(true);
    }
  };

  const generate = async () => {
    // https://sdk-backend.prod.biconomy.io/v1/smart-accounts/chainId/80001/owner/0x4E8Ae114cdaD16e3060dC056a5545D7f1442b652/index/0
    for (let i = 0; i < chains.length; i++) {
      let res = await fetch(
        `https://sdk-backend.prod.biconomy.io/v1/smart-accounts/chainId/${chains[i].chain_id}/owner/${address}/index/0`,
        {}
      );
      if (res.status === 200) {
        let response = await res.json();
        if (response.code === 200) {
          let temp = [...scwData];
          let data = response.data;
          temp[i].address = data[0].smartAccountAddress;
          setScwData(temp);
        }
      }
    }
  };
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
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr 1.4fr",
        }}
        templateRows={{
          base: "repeat(2, 1fr)",
          lg: "1fr",
        }}
        gap={"20px"}
      >
        <Banner
          gridArea={{
            base: "1 / 1 / 2 / 2",
            lg: "auto", // Adjust if needed based on the desired layout
          }}
          banner={banner}
          name={name}
          avatar={avatar}
          job={address}
          posts='17'
          followers='9.7k'
          following='274'
          onChange={(name) => setName(name)}
        />

        <Notifications
          used={25.6}
          total={50}
          gridArea={{
            base: "2 / 1 / 3 / 2",
            lg: "auto", // Adjust if needed based on the desired layout
            "2xl": "1 / 3 / 2 / 4",
          }}
          allowAllAddress={allowAllAddress}
          handleAllowAllAddress={handleAllowAllAddress}
          allowAllDomain={allowAllDomain}
          handleAllowAllDomain={handleAllowAllDomain}
        />
      </Grid>
      <Grid mb={"20px"}>
        <Card>
          <ComplexTable
            name='SCW Address'
            columnsData={scwColumns}
            tableData={scwData}
            input={scwInput}
            onChange={(newData) => setScwData(newData)}
          />
          <Box ml='auto'>
            <Button
              backgroundColor={greenColor}
              _hover={{ backgroundColor: greenColorDark }}
              textColor={"white"}
              onClick={generate}
            >
              Generate
            </Button>
          </Box>
        </Card>
      </Grid>
      {!allowAllAddress && (
        <Grid mb={"20px"}>
          <Card>
            <ComplexTable
              name='Whitelist Address'
              columnsData={whitelistColumns}
              tableData={whitelistData}
              input={whitelistInput}
              onChange={(newData) => setWhitelistData(newData)}
            />
          </Card>
        </Grid>
      )}
      {/* Whitelist Domains */}
      {!allowAllDomain && (
        <Grid mb={"20px"}>
          <Card>
            <Text
              color={textColorPrimary}
              fontSize='22px'
              fontWeight='700'
              lineHeight='100%'
              mb={"20px"}
            >
              Whitelist Domains
            </Text>
            {whitelistDomains.length > 0 &&
              // loop over whitelistDomains and display them
              whitelistDomains.map((domain, index) => {
                return (
                  <Box key={`whitelist-${index}`} mb={"20px"}>
                    <Flex align='center'>
                      <Text
                        color={textColorPrimary}
                        fontSize='16px'
                        fontWeight='400'
                        lineHeight='100%'
                        mr={4} // Add margin-right for spacing between text and button
                        flex={1} // Make the text take up the remaining space
                      >
                        {domain}
                      </Text>

                      <MdDelete
                        style={{ color: "red" }}
                        onClick={() => {
                          const newWhitelistDomains = whitelistDomains.filter(
                            (item, i) => i !== index
                          );
                          setWhitelistDomains(newWhitelistDomains);
                        }}
                      />
                    </Flex>
                  </Box>
                );
              })}
            <Input
              placeholder='Enter domain'
              mb={"20px"}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <Box ml='auto' mt={"20px"}>
              <Button
                backgroundColor={greenColor}
                _hover={{ backgroundColor: greenColorDark }}
                textColor={"white"}
                onClick={() => {
                  setWhitelistDomains([...whitelistDomains, newDomain]);
                  setNewDomain("");
                }}
              >
                Add
              </Button>
            </Box>
          </Card>
        </Grid>
      )}
      <Grid mb={"20px"}>
        <Box mx={"auto"}>
          <Button
            backgroundColor={blueColor}
            _hover={{ backgroundColor: blueColorDark }}
            textColor={"white"}
            px={"40px"}
            onClick={save}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}
