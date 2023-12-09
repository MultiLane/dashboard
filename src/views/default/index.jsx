// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { api, roundValue } from "constant";
import { useEffect, useState } from "react";
import { MdAttachMoney, MdBarChart } from "react-icons/md";
import ComplexTable from "views/components/ComplexTable";
import DailyTraffic from "views/default/components/DailyTraffic";
import PieCard from "views/default/components/PieCard";
import { columnsDataComplex } from "views/default/variables/columnsData";

const defaultBarChartDataDailyTraffic = [
  {
    name: "Daily Transaction",
    data: [0, 0, 0, 0, 0, 0, 0],
  },
];

export const defaultBarChartOptionsDailyTraffic = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["00", "04", "08", "12", "14", "16", "18"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: "#4318FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgba(67, 24, 255, 1)",
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "40px",
    },
  },
};

export default function UserReports() {
  const [bill, setBill] = useState(0);
  const [balance, setBalance] = useState(0);
  const [tableDataComplex, setTableDataComplex] = useState([]);
  const [average, setAverage] = useState(0);
  const [barChartDataDailyTraffic, setBarChartDataDailyTraffic] = useState(
    defaultBarChartDataDailyTraffic
  );
  const [barChartOptionsDailyTraffic, setBarChartOptionsDailyTraffic] =
    useState(defaultBarChartOptionsDailyTraffic);

  const [pieChartData, setPieChartData] = useState([]);

  // run code after the component is mounted
  useEffect(() => {
    let profileData = async () => {
      let res = await api("GET", "/api/profile", {});
      setBill(res.bill);
      setBalance(res.balance);
      let transactions = res.transactions.map((item) => {
        let modifiedItem = { ...item };
        modifiedItem.amount = roundValue(item.amount);
        return modifiedItem;
      });
      setTableDataComplex(transactions);
      let tempOptions = { ...barChartOptionsDailyTraffic };
      tempOptions.xaxis.categories = res.daily_transaction_key;
      setBarChartOptionsDailyTraffic(tempOptions);
      setBarChartDataDailyTraffic([
        {
          name: "Daily Transaction",
          data: res.daily_transaction_value,
        },
      ]);
      setPieChartData(res.chain_distribution);
      setAverage(res.average);
    };
    profileData();
  }, []);

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'
      >
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Bill for this month'
          value={`${roundValue(bill)} USDC`}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Total balance'
          value={`${roundValue(balance)} USDC`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Transaction count'
          value={tableDataComplex.length ? tableDataComplex.length : 0}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
          name='Transactions'
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          {average ? (
            <DailyTraffic
              average={average}
              barChartDataDailyTraffic={barChartDataDailyTraffic}
              barChartOptionsDailyTraffic={barChartOptionsDailyTraffic}
            />
          ) : (
            <></>
          )}

          <PieCard pieChartData={pieChartData} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
