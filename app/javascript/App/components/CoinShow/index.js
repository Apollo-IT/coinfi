import React, { Component, Fragment } from 'react'
import {
  Layout,
  Card,
  Button,
  Menu,
  Dropdown,
  Icon,
  List,
  Col,
  Row,
} from 'antd'
import styled from 'styled-components'
import FlexGrid from './../shared/FlexGrid'
import FlexGridItem from './../shared/FlexGridItem'
import SearchCoins from './../shared/SearchCoins'
import CoinCharts from './../CoinCharts'
import SectionHeader from './../shared/SectionHeader'
import SectionHeaderTight from './../shared/SectionHeaderTight'
import CustomIcon from '../Icon'
import CoinListDrawer from './../shared/CoinListDrawer'
import CoinList from './../shared/CoinList'
import newsfeedContainer from './../../containers/newsfeed'

const { Header, Footer, Content } = Layout

class CoinShow extends Component {
  state = {
    liveCoinArr: [],
  }
  watchlistHandler(coin) {
    window.location = `/coins/${coin
      .get('name')
      .replace(/ /, '-')
      .toLowerCase()}`
  }
  render() {
    const {
      symbol,
      priceData,
      annotations,
      isTradingViewVisible,
      coinObj,
    } = this.props
    const fundamentalsData = [
      {
        title: 'Market cap',
        value: coinObj.market_cap.usd.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
      },
      {
        title: '24HR',
        value: (
          <span
            style={
              coinObj.change24h > 0
                ? { color: '#12d8b8' }
                : { color: '#ff6161' }
            }
          >
            {coinObj.change24h.toLocaleString('en-US')}%
          </span>
        ),
      },
      {
        title: '7D',
        value: (
          <span
            style={
              coinObj.change7d > 0 ? { color: '#12d8b8' } : { color: '#ff6161' }
            }
          >
            {coinObj.change7d.toLocaleString('en-US')}%
          </span>
        ),
      },
      {
        title: 'Circulating supply',
        value: coinObj.available_supply.toLocaleString('en-US'),
      },
    ]
    const linksData = [
      {
        linkType: 'Website',
        value: coinObj.website,
      },
      {
        linkType: 'Whitepaper',
        value: coinObj.Whitepaper,
      },
      {
        linkType: 'Explorer',
        value: coinObj.explorer,
      },
      {
        linkType: 'Twitter',
        value: coinObj.twitter,
      },
      {
        linkType: 'Github',
        value: coinObj.github,
      },
    ]
    let coinsCollection
    if (this.state.liveCoinArr.length) {
      coinsCollection = this.state.liveCoinArr
    } else {
      coinsCollection = this.props.coins
    }

    const percentChange1h = {
      positive: coinObj.change1h > 0,
      value: coinObj.change1h,
    }

    return (
      <Fragment>
        <Layout>
          <Content>
            {window.isDesktop && (
              <div
                style={{
                  width: 200,
                  float: 'left',
                  background: '#fff',
                  borderRight: '1px solid #e8e8e8',
                }}
              >
                <CoinList
                  {...this.props}
                  watchlistHandler={this.watchlistHandler}
                />
              </div>
            )}
            <div style={window.isDesktop ? { marginLeft: 200 } : {}}>
              <SectionHeader>
                <HideLarge>
                  <Button
                    type="primary"
                    icon="bars"
                    onClick={() =>
                      this.props.enableUI('coinListDrawer', {
                        fullScreen: true,
                      })
                    }
                  >
                    Coin List
                  </Button>
                </HideLarge>

                <SearchCoins {...this.props} coinShow />
              </SectionHeader>

              <div style={{ background: '#fff' }}>
                <ButtonWrap>
                  <Dropdown overlay={currencyMenu}>
                    <Button style={{ marginLeft: 8, margin: 10 }}>
                      USD <Icon type="down" />
                    </Button>
                  </Dropdown>
                  <Button icon="star">Watch coin</Button>
                </ButtonWrap>
                <Section>
                  <Div>
                    <img
                      alt={coinObj.name}
                      height="56"
                      src={coinObj.image_url}
                      width="56"
                    />
                  </Div>
                  <Div>
                    <Span style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {coinObj.name}
                    </Span>
                    <Span style={{ fontSize: 16 }}>{symbol}</Span>
                  </Div>
                  <Div>
                    <Span style={{ fontSize: 18, fontWeight: 'bold' }}>
                      ${coinObj.price.usd}
                    </Span>
                    <Span
                      style={
                        ({ fontSize: 14 },
                        percentChange1h.positive
                          ? { color: '#12d8b8' }
                          : { color: '#ff6161' })
                      }
                    >
                      {percentChange1h.value}%
                    </Span>
                  </Div>
                </Section>

                <div
                  style={{
                    background: '#f6f8fa',
                    padding: '0 .5rem',
                    border: '1px solid #e5e6e6',
                  }}
                >
                  <FlexGrid>
                    <FlexGridItem colWidth={2}>
                      <Card title="Price chart" style={cardStyle}>
                        <CoinCharts
                          symbol={symbol}
                          priceData={priceData}
                          annotations={annotations}
                          isTradingViewVisible={isTradingViewVisible}
                        />
                      </Card>
                    </FlexGridItem>
                    <FlexGridItemWrap>
                      <FlexGridItem>
                        <Card title="Fundamentals" style={cardStyle}>
                          <List
                            itemLayout="horizontal"
                            dataSource={fundamentalsData}
                            renderItem={(item) => {
                              return (
                                <List.Item>
                                  <List.Item.Meta
                                    title={item.title}
                                    description={item.value}
                                  />
                                </List.Item>
                              )
                            }}
                          />
                        </Card>
                      </FlexGridItem>
                      <FlexGridItem>
                        <Card title="Links" style={cardStyle}>
                          <List
                            itemLayout="horizontal"
                            dataSource={linksData}
                            renderItem={(item) => {
                              if (item.value) {
                                return (
                                  <List.Item>
                                    <a href={item.value}>{item.linkType}</a>
                                  </List.Item>
                                )
                              }
                              return <Fragment />
                            }}
                          />
                        </Card>
                      </FlexGridItem>
                    </FlexGridItemWrap>
                  </FlexGrid>
                </div>
              </div>
            </div>
            <CoinListDrawer {...this.props} coins={coinsCollection} />
          </Content>
          <Footer />
        </Layout>
      </Fragment>
    )
  }
}

export default newsfeedContainer(CoinShow)

const ButtonWrap = styled.div`
  text-align: right;
  margin: 0 1rem;
  @media (min-width: 900px) {
    float: right;
    margin-top: 2.5rem;
  }
`

const Section = styled.section`
  text-align: center;
  margin: 3rem 0;
  @media (min-width: 900px) {
    text-align: left;
    margin: 0 0 0 1rem;
    padding-top: 1rem;
  }
`

const Div = styled.div`
  margin-bottom: 2rem;
  @media (min-width: 900px) {
    display: inline-block;
    margin-right: 1rem;
  }
`

const Span = styled.span`
  margin: 0 0.5rem;
`

const HideLarge = styled.div`
  @media (min-width: 900px) {
    display: none;
  }
`
const FlexGridItemWrap = styled.div`
  width: 100%;
  @media (min-width: 900px) {
    width: auto;
    width: 32%;
  }
`

const currencyMenu = (
  <Menu>
    <Menu.Item key="1">USD</Menu.Item>
    <Menu.Item key="2">BTC</Menu.Item>
  </Menu>
)

const cardStyle = {
  flexGrow: 1,
  margin: '1rem .5rem 0 .5rem',
}