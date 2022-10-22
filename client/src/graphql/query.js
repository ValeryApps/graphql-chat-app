import { gql } from '@apollo/client'
export const GET_USERS = gql`
 query{
        users {
            firstName, lastName, email, id
        }
    }
`
export const GET_USER_MESSAGE = gql`
query loadUserMessages($receiverId: Int!){
    userMessages(receiverId:$receiverId){
    text receiverId senderId id
    }
}
`
export const GET_CURRENT_USER = gql`
query{
    currentUser{
    firstName lastName id email
    }
}
`
export const GET_USER_By_ID = gql`
query getUser($userId:ID!){
    user(id:$userId){
    firstName lastName id email
    }
}
`