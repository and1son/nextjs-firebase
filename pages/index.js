import { Alert, Avatar, Container, IconButton, Snackbar, Typography } from '@mui/material'
import { useState } from 'react';
import TodoList from '../components/TodoList'
import TodoForm from '../components/TodoForm'
import { TodoContext } from './TodoContext';
import Loading from '../components/Loading';
import Login from '../components/Login.js';
import { useAuth } from '../Auth';
import { Box } from '@mui/system';
import { auth, db } from '../firebase';
import { verifyIdToken } from '../firebaseAdmin';
import nookies from 'nookies';
import { collection, getDocs, orderBy, query, where } from '@firebase/firestore';

export default function Home(todosProps) {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [todo, setTodo] = useState({ title: '', detail: '' })

  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <TodoContext.Provider value={{ showAlert, todo, setTodo }}>

      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt={3}>
          <IconButton onClick={() => auth.signOut()}>
            <Avatar src={currentUser.photoURL} />
          </IconButton>
          <Typography variant="h5">
            {currentUser.displayName}
          </Typography>
        </Box>
        <TodoForm />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <TodoList />
      </Container>
    </TodoContext.Provider>
  )
}

export async function getServerSideProps(context) {

  try {
    const cookies = nookies.get(context);
    const token = await verifyIdToken(cookies.token);
    const { email } = token;
    const collectionRef = collection(db, "todos")
    const q = query(collectionRef, where("email", "==", email), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    let todos = [];
    querySnapshot.forEach((doc) => {
      todos.push({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp.toDate().getTime() });
    });
    return {

      props: {
        todosProps: JSON.stringify(todos) || [],

      }
    };
  } catch (error) {
    return { props: {} };
  }



}
