import { Button, TextField } from "@mui/material"
import { useState } from "react"

const TodoForm = () => {
    const [todo, setTodo] = useState({ title: '', detail: '' })
    return (
        <div>
            <pre>{JSON.stringify(todo)}</pre>
            <TextField fullWidth label="title" margin="normal"
                value={todo.title}
                onChange={e => setTodo({ ...todo, title: e.target.value })}
            />
            <TextField fullWidth label="detail" multiline maxRows={4}
                value={todo.detail}
                onChange={e => setTodo({ ...todo, detail: e.target.value })}
            />
            <Button variant="contained" sx={{ mt: 3 }}> Add a new todo!</Button>
        </div>
    )
}

export default TodoForm
