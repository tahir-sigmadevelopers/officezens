import React from 'react'
import HomeSection from '../components/HomeSection'
import ProductsHome from '../components/ProductsHome'
import LatestTrends from '../components/TrendsHome'
import FashionTrends from '../components/FashionTrends'
import SuccessHistory from '../components/SuccessHistory'
import Carousel, { HomeNavbar } from '../components/HomeBanner'

const Home = () => {
    return (
        <>
            {/* <HomeSection /> */}
            {/* <HomeNavbar /> */}
            <Carousel />
            <ProductsHome />
            <LatestTrends />
            <FashionTrends />
            <SuccessHistory />

        </>)
}

export default Home