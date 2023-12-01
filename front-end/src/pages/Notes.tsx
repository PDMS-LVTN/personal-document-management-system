import { Button, GridItem } from "@chakra-ui/react";
import axios from "../api/axios";
import { useAuthentication } from "../store/useAuth";

const URL = "note/all_note"

const Notes = () => {

  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);



  const handleSubmit = async (e) => {
    console.log(auth?.accessToken)
    try {
      const response = await axios.post(
        URL,
        JSON.stringify({  }),
        {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${auth.accessToken}` },
        }
      );
      
    } catch (err) {
     console.log(err.response.data)
      setAuth(undefined)
      }
    }

  return (
    <>
      <GridItem rowSpan={1} colSpan={3} bg="#FAF9FE" />
      <GridItem rowSpan={1} colSpan={6} bg="white">
      <Button
              colorScheme="brand"
              backgroundColor="brand.400"
              color="white"
              w="100%"
              size="lg"
              onClick={handleSubmit}
            >
              GET NOTES
            </Button>
      </GridItem>
    </>
  );
};

export default Notes;
