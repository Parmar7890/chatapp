import ChatScreen from './screens/ChatScreen';


function App() {

 const params = new URLSearchParams(window.location.search);
  const MY_USER_ID = Number(params.get('userId')) || 1;
  const RECEIVER_ID = Number(params.get('receiverId')) || 2;

  return (
    <>
     <ChatScreen myUserId={MY_USER_ID} receiverId={RECEIVER_ID} />
    </>
  )
}

export default App
