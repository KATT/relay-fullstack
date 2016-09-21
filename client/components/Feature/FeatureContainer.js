import Relay from 'react-relay';
import Feature from './FeatureComponent';

export default Relay.createContainer(Feature, {
  initialVariables: {
    limit: 20,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        features(first: $limit) {
          edges {
            node {
              id
              name
              description
              url
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }`
  }
});
