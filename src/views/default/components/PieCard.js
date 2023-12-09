// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { VSeparator } from "components/separator/Separator";
import React, { Fragment, useEffect } from "react";
export const defaultPieChartData = [63, 25, 12];
export const defaultPieChartOptions = {
  labels: ["Your files", "System", "Empty"],
  colors: [
    "#4318FF",
    "#6AD2FF",
    "#EFF4FB",
    "#8F4D9A",
    "#3B87C7",
    "#F7A24E",
    "#72D697",
    "#E53D53",
    "#C48E2A",
    "#4BC7A5",
    "#9C72E8",
    "#F35A7D",
    "#4FA2D1",
    "#D6498F",
    "#7ECB45",
    "#BA3E6F",
    "#56AED5",
    "#E8682D",
    "#A05CBF",
    "#3F9F62",
  ],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#EFF4FB"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
  },
};

export default function Conversion(props) {
  const { ...rest } = props;
  delete rest["pieChartData"];
  const [data, setData] = React.useState([]);
  const [pieChartData, setPieChartData] = React.useState(defaultPieChartData);
  const [pieChartOptions, setPieChartOptions] = React.useState(
    defaultPieChartOptions
  );

  useEffect(() => {
    // loop over props.pieChartData and create a new array of objects
    // with the correct format for the chart
    let chartData = [];
    let chartColors = [];
    let chartLabels = [];
    const newData = props.pieChartData.map((item, index) => {
      let newColor = pieChartOptions.colors[index];
      chartData.push(item.count);
      chartColors.push(newColor);
      chartLabels.push(item.chain);
      return {
        chain: item.chain,
        count: item.count,
        color: newColor,
      };
    });
    setPieChartData(chartData);
    let newOptions = pieChartOptions;
    newOptions.colors = chartColors;
    newOptions.labels = chartLabels;
    setPieChartOptions(newOptions);
    setData(newData);
  }, [props.pieChartData]);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'
      >
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Transactions across different chains
        </Text>
      </Flex>
      {data.length !== 0 && (
        <PieChart
          h='100%'
          w='100%'
          chartData={pieChartData}
          chartOptions={pieChartOptions}
        />
      )}
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'
      >
        {data.map((item, index) => {
          return (
            <Fragment key={`item-${index}`}>
              <Flex direction='column' py='5px' key={`name-${index}`}>
                <Flex align='center'>
                  <Box
                    h='8px'
                    w='8px'
                    bg={item.color}
                    borderRadius='50%'
                    me='4px'
                  />
                  <Text
                    fontSize='xs'
                    color='secondaryGray.600'
                    fontWeight='700'
                    mb='5px'
                  >
                    {item.chain}
                  </Text>
                </Flex>
                <Text fontSize='lg' color={textColor} fontWeight='700'>
                  {item.count}
                </Text>
              </Flex>
              <VSeparator
                key={`sep-${index}`}
                mx={{ base: "60px", xl: "60px", "2xl": "60px" }}
              />
            </Fragment>
          );
        })}
      </Card>
    </Card>
  );
}
