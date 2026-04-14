const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type WaitlistRequest {
    id: ID!
    parentName: String!
    childName: String!
    childAge: Int!
    startDate: String!
    location: String!
    user: User
  }

  type Query {
    currentUser: User
    myRequests: [WaitlistRequest]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: String

    addRequest(
      parentName: String!
      childName: String!
      childAge: Int!
      startDate: String!
      location: String!
    ): WaitlistRequest

    updateRequest(
      id: ID!
      parentName: String!
      childName: String!
      childAge: Int!
      startDate: String!
      location: String!
    ): WaitlistRequest

    deleteRequest(id: ID!): String
  }
`;