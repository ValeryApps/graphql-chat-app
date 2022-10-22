import { gql } from '@apollo/client';


export const SEND_CHAT_MESSAGE = gql`
subscription Subscription {
  addMessage {
    id
    text
    senderId
    receiverId
    CreatedAt
  }
}
`