import * as React from 'react';
import NewsfeedPage from './NewsfeedPage';
import CoinListContext from '../../contexts/CoinListContext';
import NewsfeedContext, { NewsfeedContextType } from '../../contexts/NewsfeedContext';

interface Props {
  categories: string[]
  feedSources: string[]
  coinSlug?: string
  newsItemId?: string
}

const NewsfeedPageContainer = (props: Props) => (
  <NewsfeedContext.Consumer>
    {
      (newsfeedPayload: NewsfeedContextType) => (
        <CoinListContext.Consumer>
          {
            (coinlistPayload) => (
              <NewsfeedPage 
                coinSlug={props.coinSlug} 
                newsItemId={props.newsItemId} 
                coinlist={coinlistPayload.coinlist}
                newslist={newsfeedPayload.newslist}
                isNewsfeedLoading={newsfeedPayload.isLoading}
                isNewsfeedLoadingMoreItems={newsfeedPayload.isLoadingMoreItems}
                isNewsfeedReady={newsfeedPayload.isReady}
                isCoinlistLoading={coinlistPayload.isLoading}
                isCoinlistReady={coinlistPayload.isReady}
                fetchNewsItems={newsfeedPayload.fetchNewsItems}
                fetchMoreNewsItems={newsfeedPayload.fetchMoreNewsItems}
                fetchNewNewsItems={newsfeedPayload.fetchNewNewsItems}
                cleanNewsItems={newsfeedPayload.cleanNewsItems}
                categories={props.categories}
                feedSources={props.feedSources}
              />
            )
          }
        </CoinListContext.Consumer>
      )
    }
  </NewsfeedContext.Consumer>
);

export default NewsfeedPageContainer;
