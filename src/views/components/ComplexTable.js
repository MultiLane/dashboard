import {
  Flex,
  Table,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Link,
  Button,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";

// Assets
import {
  MdCheckCircle,
  MdCancel,
  MdOutlineError,
  MdPending,
} from "react-icons/md";
export default function ColumnsTable(props) {
  const { columnsData, name, input, tableData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const [data, setData] = useState(tableData);
  useEffect(() => {
    setData(props.tableData);
    // for loop through all the props.tableData and check if the address exist and set the value
    for (let i = 0; i < props.tableData.length; i++) {
      if (
        props.tableData[i].address &&
        Object.keys(input).includes("ADDRESS")
      ) {
        let ele = document.getElementById(`ADDRESS-${i}`);
        if (ele) ele.value = ele.getAttribute("value");
      }
    }
  }, [props.tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,
    state: { pageIndex, pageSize },
    setPageSize, // Function to set the pageSize
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'
        >
          {name}
        </Text>
        <Flex align='center'>
          {/* Change pageSize example */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          &nbsp;
          {/* Next and Previous buttons */}
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Prev
          </Button>
          <span>
            <strong>
              &nbsp; &nbsp;
              {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
              &nbsp;
            </strong>
          </span>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            variant='solid'
          >
            Next
          </Button>
        </Flex>
      </Flex>

      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'
                  >
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, row_index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={row_index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "STATUS") {
                    data = (
                      <Flex align='center'>
                        <Icon
                          w='24px'
                          h='24px'
                          me='5px'
                          color={
                            cell.value === "Approved"
                              ? "green.500"
                              : cell.value === "Rejected"
                              ? "red.500"
                              : cell.value === "Error"
                              ? "orange.500"
                              : cell.value === "Pending"
                              ? "blue.500"
                              : null
                          }
                          as={
                            cell.value === "Approved"
                              ? MdCheckCircle
                              : cell.value === "Rejected"
                              ? MdCancel
                              : cell.value === "Error" &&
                                cell.value !== "Pending"
                              ? MdOutlineError
                              : cell.value === "Pending"
                              ? MdPending
                              : null
                          }
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "LINK") {
                    data = (
                      <Flex align='center'>
                        <Link
                          fontSize='sm'
                          fontWeight='700'
                          target='_blank'
                          href={cell.value}
                        >
                          {(() => {
                            if (!cell.value) return;
                            // link has / at the end then we need to remove it
                            if (cell.value[cell.value.length - 1] === "/") {
                              cell.value = cell.value.slice(0, -1);
                            }
                            let link = cell.value.split("/");
                            let hash = link[link.length - 1];
                            return (
                              hash.substring(0, 6) +
                              "..." +
                              hash.substring(hash.length - 4, hash.length)
                            );
                          })()}
                        </Link>
                      </Flex>
                    );
                  } else {
                    data = (
                      <Flex align='center'>
                        {Object.keys(input ? input : {}).includes(
                          cell.column.Header
                        ) && cell.value != undefined ? (
                          <Input
                            size='sm'
                            textColor={textColor}
                            type={
                              input[cell.column.Header]
                                ? input[cell.column.Header]
                                : "text"
                            }
                            defaultValue={cell.value ? cell.value : ""}
                            id={`${cell.column.Header}-${row_index}`}
                            onChange={(e) => {
                              props.tableData[row_index][
                                props.columnsData[index].accessor
                              ] = e.target.value;
                              if (props.onChange)
                                props.onChange(props.tableData);
                            }}
                          />
                        ) : (
                          <Text
                            color={textColor}
                            fontSize='sm'
                            fontWeight='700'
                          >
                            {cell.value}
                          </Text>
                        )}
                      </Flex>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      maxH='30px !important'
                      py='8px'
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor='transparent'
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
