const { gql } = require('apollo-server-express')

exports.typeDefs = gql`
 type Query{
    users:[User]
    user(id:ID!):User
    currentUser:User
    userMessages(receiverId:Int!):[Message]
  }
  type Mutation{
    registerUser(input:userInput!):User
    loginUser(input:loginInput!):Token
    sendMessage(input:sendMessageInput!):Message
  }
  type Subscription{
    addMessage:Message
  }
type Token{
  token:String
}
input userInput{
    firstName:String 
    lastName:String 
    email:String,
    password:String
}
input loginInput{
  email:String 
  password:String
}
input sendMessageInput{
  text:String 
  receiverId:ID
}
  type User{
    id:ID!
    firstName:String
    lastName:String 
    email:String
    password:String
    sentMessages:[Message]
    receivedMessages:[Message]
  }
type Message {
  id:ID!
  text:String
  senderId:ID 
  receiverId:ID
  CreatedAt:String

}
 `