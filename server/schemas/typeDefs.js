const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth

    addApplication(
      company: String!
      role: String!
      status: String
      appliedDate: String
      notes: String
      link: String
    ): User

    updateApplication(
      applicationId: ID!
      company: String
      role: String
      status: String
      notes: String
    ): User

    removeApplication(applicationId: ID!): User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    applicationCount: Int
    applications: [Application]
  }

  type Application {
    _id: ID!
    company: String!
    role: String!
    status: String
    appliedDate: String
    notes: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;