import { GridItem } from "@chakra-ui/react";
import axios from "../api/axios";


const Notes = () => {
  return (
    <>
      <GridItem rowSpan={1} colSpan={3} bg="#FAF9FE" />
      <GridItem rowSpan={1} colSpan={6} bg="white" />
    </>
  );
};

export default Notes;
