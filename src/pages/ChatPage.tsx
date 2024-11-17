import {useParams} from "react-router-dom";

const ChatPage = () => {
    const {id} = useParams();
    return (
        <p className={'text-white'}>Chat {id}</p>
    )
}

export default ChatPage;