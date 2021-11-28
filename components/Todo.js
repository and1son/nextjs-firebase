import { IconButton, ListItem, ListItemText } from "@mui/material";
import { useContext } from "react"
import { TodoContext } from "../pages/TodoContext"

import moment from "moment";
import { doc, deleteDoc } from "@firebase/firestore";
import { db } from "../firebase";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Todo = ({ id, timestamp, title, detail }) => {

    const { showAlert, setTodo } = useContext(TodoContext)

    const deleteTodo = async (id, e) => {
        e.stopPropagation();
        const docRef = doc(db, "todos", id);
        await deleteDoc(docRef)
        showAlert('error', `Todo with ${id} is deleted`)
    }


    return (
        <ListItem onClick={() => setTodo({ id, title, detail, timestamp })}
            sx={{ mt: 3, boxShadow: 3 }}
            style={{ backgroundColor: '#FAFAFA' }}
            secondaryAction={
                <>
                    <IconButton onClick={e => deleteTodo(id, e)}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </>
            }
        >
            <ListItemText
                primary={title}
                secondary={moment(timestamp).format("DD.MM.YYYY")}
            />

        </ListItem>

    )
}

export default Todo
