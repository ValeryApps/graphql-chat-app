import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
mutation Register($input:userInput!){
  registerUser(input:$input){
   firstName email lastName
  }
}
`
export const LOGIN_USER = gql`
mutation Login($input:loginInput!){
  loginUser(input:$input){
   token
  }
}
`
export const SEND_MESSAGE = gql`
mutation CreateMessage($msg:sendMessageInput!){
 sendMessage(input:$msg){
 text 
 }
}
`