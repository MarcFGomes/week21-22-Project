import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_APPLICATION = gql`
  mutation addApplication(
    $company: String!
    $role: String!
    $status: String
    $appliedDate: String
    $notes: String
    $link: String
  ) {
    addApplication(
      company: $company
      role: $role
      status: $status
      appliedDate: $appliedDate
      notes: $notes
      link: $link
    ) {
      _id
      applicationCount
      applications {
        _id
        company
        role
        status
        appliedDate
        notes
        link
      }
    }
  }
`;

export const UPDATE_APPLICATION = gql`
  mutation updateApplication(
    $applicationId: ID!
    $company: String
    $role: String
    $status: String
    $notes: String
  ) {
    updateApplication(
      applicationId: $applicationId
      company: $company
      role: $role
      status: $status
      notes: $notes
    ) {
      _id
      applications {
        _id
        company
        role
        status
        notes
      }
    }
  }
`;

export const REMOVE_APPLICATION = gql`
  mutation removeApplication($applicationId: ID!) {
    removeApplication(applicationId: $applicationId) {
      _id
      applicationCount
      applications {
        _id
      }
    }
  }
`;