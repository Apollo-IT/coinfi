import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import NewsListItem from './NewsListItem'
import LoadingIndicator from '../LoadingIndicator'
import Tips from './Tips'
import scrollHelper from '../../scrollHelper'

class NewsList extends Component {
  state = { initialRender: true, initialRenderTips: false }

  componentDidMount() {
    // set max height to enable scroll in ff
    scrollHelper()
  }

  setActiveNewsItem = (newsItem) => {
    const { setActiveEntity, enableUI } = this.props
    const url = newsItem.get('url')
    const urlFragments = url.split('/')
    const tweetId = urlFragments[urlFragments.length - 1]
    if (/twitter/.exec(url) !== null) {
      setActiveEntity({ type: 'twitterNews', id: newsItem.get('id'), tweetId })
    } else {
      setActiveEntity({ type: 'newsItem', id: newsItem.get('id') })
    }
    if (window.isMobile) {
      enableUI('bodySectionDrawer', { fullScreen: true })
    }
  }

  closeTips() {
    this.props.newsfeedTips()
  }

  renderView(
    viewState,
    initialRenderTips,
    readNewsIds,
    isLoading,
    fetchMoreNewsFeed,
    user,
    loggedIn,
  ) {
    if (initialRenderTips && window.isMobile) {
      return (
        <Tips
          closeTips={this.closeTips.bind(this)}
          user={user}
          loggedIn={loggedIn}
        />
      )
    } else if (isLoading('newsItems')) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    } else if (!viewState.sortedNewsItems.length) {
      return (
        <div className="pa3 tc mt4">
          <div className="pointer">
            <h4 className="fw6 mv3 f4">No results found.</h4>
          </div>
          <div className="flex justify-between flex-wrap">
            <div className="f6 silver center">
              <span className="ph2">
                Try changing your search query or removing some filters.
              </span>
            </div>
          </div>
        </div>
      )
    }

    const mappedItems = viewState.sortedNewsItems.map((newsItem) => {
      const hasRead = readNewsIds.includes(newsItem.get('id'))
      return (
        <NewsListItem
          key={newsItem.get('id')}
          newsItem={newsItem}
          {...this.props}
          setActiveNewsItem={this.setActiveNewsItem}
          selectCoin={(symbol) => this.selectCoin(symbol)}
          hasRead={hasRead}
        />
      )
    })

    return (
      <InfiniteScroll
        dataLength={mappedItems.length}
        scrollableTarget="newsfeed"
        next={fetchMoreNewsFeed}
        hasMore={true} // TODO: Actually determine when there are no more NewsItems...
        loader={<LoadingIndicator />}
      >
        {mappedItems}
      </InfiniteScroll>
    )
  }

  selectCoin(coinData) {
    const { setFilter, clearSearch, setActiveEntity } = this.props
    setActiveEntity({ type: 'coin', id: coinData.get('id') })
    if (this.selectedCoins) {
      let value = this.selectedCoins()
      value = union(value, [coinData.get('name')]) // eslint-disable-line no-undef
      setFilter({ key: 'coins', value })
      clearSearch()
    }
  }

  render() {
    const {
      newsItems,
      isLoading,
      activeEntity,
      activeFilters,
      sortedNewsItems,
      initialRenderTips,
      fetchMoreNewsFeed,
      user,
      loggedIn,
    } = this.props
    const viewState = {
      activeEntity: activeEntity,
      newsItems: newsItems,
      sortedNewsItems: sortedNewsItems,
    }
    const readNewsIds = JSON.parse(localStorage.getItem('readNews')) || []
    const marginTopVal = document.querySelector('.topnav').offsetHeight * -1

    return (
      <div
        id="newsfeed"
        className="flex-auto relative overflow-y-scroll"
        style={
          !activeEntity &&
          window.isMobile &&
          !activeFilters.size &&
          initialRenderTips
            ? {
                marginTop: marginTopVal,
                background: '#fff',
                position: 'absolute',
                maxHeight: 'none',
                overflow: 'hidden',
              }
            : {}
        }
      >
        {this.renderView(
          viewState,
          initialRenderTips,
          readNewsIds,
          isLoading,
          fetchMoreNewsFeed,
          user,
          loggedIn,
        )}
      </div>
    )
  }
}

export default NewsList
