import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Select, VStack, HStack, Text, IconButton, Table, Thead, Tbody, Tr, Th, Td, Icon, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileDownload } from "react-icons/fa";

const Index = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    type: "income",
    category: "salary",
    id: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addTransaction = () => {
    if (formData.date && formData.amount) {
      if (formData.id === null) {
        setTransactions([...transactions, { ...formData, id: Date.now() }]);
      } else {
        setTransactions(transactions.map((transaction) => (transaction.id === formData.id ? { ...formData } : transaction)));
      }
      setFormData({
        date: "",
        amount: "",
        type: "income",
        category: "salary",
        id: null,
      });
    } else {
      toast({
        title: "Error",
        description: "Date and amount are required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const editTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setFormData({ ...transaction });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const getTotalBalance = () => {
    return transactions
      .reduce((balance, transaction) => {
        return transaction.type === "income" ? balance + parseFloat(transaction.amount) : balance - parseFloat(transaction.amount);
      }, 0)
      .toFixed(2);
  };

  const exportTransactions = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transactions))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <Input type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={formData.category} onChange={handleInputChange}>
            <option value="salary">Salary</option>
            <option value="groceries">Groceries</option>
            <option value="bills">Bills</option>
          </Select>
        </FormControl>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={addTransaction}>
          {formData.id ? "Update" : "Add"} Transaction
        </Button>
      </VStack>
      <Box my={8}>
        <Text fontSize="xl">Transactions</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.date}</Td>
                <Td>{transaction.amount}</Td>
                <Td>{transaction.type}</Td>
                <Td>{transaction.category}</Td>
                <Td>
                  <HStack>
                    <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => editTransaction(transaction.id)} />
                    <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => deleteTransaction(transaction.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {transactions.length === 0 && (
          <Text mt={2} textAlign="center">
            No transactions found.
          </Text>
        )}
      </Box>
      <HStack justifyContent="space-between">
        <Text fontSize="xl">Total Balance: ${getTotalBalance()}</Text>
        <Button leftIcon={<FaFileDownload />} onClick={exportTransactions}>
          Export Transactions
        </Button>
      </HStack>
    </Container>
  );
};

export default Index;
