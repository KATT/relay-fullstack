/* eslint-disable global-require */
import React from 'react';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';
import Page from '../Page/PageComponent';
import styles from './Feature.scss';
import AddFeature from './AddFeatureComponent';

export default class Feature extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    relay: React.PropTypes.object.isRequired,
  };
  state = {
    isLoading: false,
  };

  loadMore = () => {
    this.setState({ isLoading: true });

    this.props.relay.setVariables({
      limit: this.props.relay.variables.limit + 10,
    }, () => {
      this.setState({ isLoading: false });
    });
  };

  render() {
    const {
      viewer,
      viewer: {
        features
      }
    } = this.props;
    return (
      <div>
        <Page heading='Integrated with'>
          <Grid>
            {features.edges.map((edge) => {
              const {
                node: {
                  id,
                  name,
                  description,
                  url,
                }
              } = edge;
              const imageUrl = require(`../../assets/${name.toLowerCase()}.png`);
              return (
                <Cell col={4} key={id}>
                  <Card className={styles.card}>
                    <CardTitle expand className={styles.image} style={{ backgroundImage: `url(${imageUrl})` }} />
                    <CardActions className={styles.name}>
                      <Button colored href={url}>{name}</Button>
                    </CardActions>
                    <CardText className={styles.description}>
                      {description}
                    </CardText>
                  </Card>
                </Cell>
              );
            })}
          </Grid>
          {features.pageInfo.hasNextPage && <Button raised accent onClick={this.loadMore} disabled={this.state.isLoading}>Load more features</Button>}
        </Page>
        <AddFeature viewer={viewer} />
      </div>
    );
  }
}
