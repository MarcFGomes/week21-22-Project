import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
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