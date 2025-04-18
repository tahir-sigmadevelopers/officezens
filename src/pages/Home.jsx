import React, { lazy, Suspense } from 'react'
import HomeSection from '../components/HomeSection'
import SuccessHistory from '../components/SuccessHistory'
import FashionTrends from '../components/FashionTrends'
import Carousel from '../components/HomeBanner'
import { Skeleton } from '../components/Loader'

// Lazy load product-related components for improved initial load time
const ProductsHome = lazy(() => import('../components/ProductsHome'))
const LatestTrends = lazy(() => import('../components/TrendsHome'))

const Home = () => {
    return (
        <>
            {/* <HomeSection /> */}
            <Carousel />
            
            {/* Use Suspense to lazy load product components */}
            <Suspense fallback={<Skeleton />}>
                <ProductsHome />
            </Suspense>
            
            <Suspense fallback={<Skeleton />}>
                <LatestTrends />
            </Suspense>
            
            <FashionTrends />
            <SuccessHistory />
        </>
    )
}

export default Home