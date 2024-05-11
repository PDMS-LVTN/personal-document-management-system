import { usePermission } from "@/hooks/usePermission";
import { useAuthentication } from "@/store/useAuth";
import {
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Globe, Users } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
// import { HiUserCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const TableRow = ({ type, data }) => {
  const navigate = useNavigate();
  const handleCopyLink = () => {
    const text = `${import.meta.env.VITE_CLIENT_PATH}/shared/${data.note_id}`;
    navigator.clipboard.writeText(text);
  };
  return (
    <Tr
      _hover={{
        background: "gray.50",
      }}
      onDoubleClick={() => navigate(`/shared/${data.note_id}`)}
    >
      <Td className="flex items-center gap-2">
        <Text>{data.title}</Text>
        {type == "private" ? (
          <Users color="var(--brand400)" size={15} />
        ) : (
          <Globe color="var(--brand400)" size={15} />
        )}
      </Td>
      <Td>
        {/* <HiUserCircle size="40px" color="var(--brand500)" /> */}
        {data.owner}
      </Td>
      <Td>{moment(data.shared_date).format("MMM DD YYYY")}</Td>
      <Td>
        <Tag size="lg" ml="auto" variant="solid" backgroundColor="brand.400">
          <TagLabel fontSize="13px">
            {data.share_mode == "view" ? "Viewer" : "Editor"}
          </TagLabel>
        </Tag>
      </Td>
      <Td>
        <Menu>
          <MenuButton
            size="xs"
            as={IconButton}
            aria-label="Options"
            icon={<FaEllipsisVertical />}
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList>
            <MenuItem onClick={handleCopyLink}>Copy link</MenuItem>
            {/* TODO: Remove */}
            <MenuItem>Remove</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
};

export const SharedNotesTable = () => {
  const { getAllSharedNotes } = usePermission();
  const auth = useAuthentication((state) => state.auth);
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const { responseData } = await getAllSharedNotes(auth.email);
      setNotes(responseData);
    };
    loadData();
  }, []);

  if (!notes) return null;
  return (
    <GridItem
      id="structure-grid-item"
      rowSpan={1}
      colSpan={9}
      bg="white"
      pos="relative"
      pt="1em"
      px={7}
      overflowY="hidden"
    >
      <Text fontSize="2xl" fontWeight="600" mb={4}>
        Shared with me
      </Text>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Shared by</Th>
              <Th>Shared date</Th>
              <Th>Permission</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notes.private_notes.map((note) => {
              return <TableRow key={note.note_id} type="private" data={note} />;
            })}
            {notes.public_notes.map((note) => {
              return <TableRow key={note.note_id} type="public" data={note} />;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </GridItem>
  );
};
