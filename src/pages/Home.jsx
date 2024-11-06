import React from 'react'
import HomeSection from '../components/HomeSection'
import ProductsHome from '../components/ProductsHome'
import LatestTrends from '../components/TrendsHome'
import FashionTrends from '../components/FashionTrends'
import SuccessHistory from '../components/SuccessHistory'

const Home = () => {
    return (
        <>
            <HomeSection />
            <ProductsHome />
            <LatestTrends />
            <FashionTrends />
            <SuccessHistory />

        </>)
}

export default Home