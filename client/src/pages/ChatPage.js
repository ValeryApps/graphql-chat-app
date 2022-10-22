import React, { useState } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { GET_USER_By_ID, GET_USER_MESSAGE } from '../graphql/query'
import { useParams } from 'react-router-dom'
import { Button, } from '@mui/material'
import { SEND_MESSAGE } from '../graphql/mutation'
import { SEND_CHAT_MESSAGE } from '../graphql/subscription'



export const ChatPage = ({ current }) => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const { id } = useParams();

    useQuery(GET_USER_MESSAGE, {
        variables: {
            receiverId: parseInt(id)
        },
        onCompleted: (data) => {
            setMessages(data?.userMessages)
        }
    })

    const { data: otherData } = useQuery(GET_USER_By_ID, {
        variables: {
            userId: parseInt(id)
        },

    });
    const [sendMessage] = useMutation(SEND_MESSAGE)
    const submitSendMessage = async (e) => {
        e.preventDefault()
        await sendMessage({
            variables: {
                msg: {
                    text: message,
                    receiverId: +id
                }
            }
        })
    }
    useSubscription(SEND_CHAT_MESSAGE, {
        onData: ({ data }) => {
            console.log(data);
            if (
                (data.data.addMessage.receiverId == +id && data.data.addMessage.senderId == current?.id) ||
                (data.data.addMessage.receiverId == current?.id && data.data.addMessage.senderId == +id)
            ) {
                setMessages((prevMessages) => [...prevMessages, data.data.addMessage])
            }
        }
    })

    console.log("messages");
    return (
        <div className='chat-page'>
            {messages?.map((message) => (
                <div key={message?.id} className={message?.receiverId !== id ? "receiver message" : "sender message"}>
                    <span className='chatter-name'>{message?.receiverId !== id ? otherData?.user.firstName + " " + otherData?.user.lastName : current?.firstName + " " + current?.lastName}</span>
                    <span> {message?.text}</span>
                </div>
            ))}
            <form className='message-form' onSubmit={submitSendMessage}>
                <input type='text' className='message-input' onChange={(e) => setMessage(e.target.value)} />
                <Button type='submit' className='message-button'>Send</Button>
            </form>
        </div>
    )
}
