import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLatestProducts, fetchProducts } from '../redux/reducers/products';

const Hompage = () => {

    const { items, latestItems } = useSelector(state => state.products)

    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchLatestProducts());
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="container mx-auto mt-12 px-4">
            <div className="grid grid-cols-2 gap-6 mb-6 lg:grid-cols-2">
                <div className="w-full px-4 py-5 rounded-lg shadow">
                    <div className="text-sm font-medium truncate">
                        Total Products
                    </div>
                    <div className="mt-1 text-3xl font-semibold">
                        {items && items.length > 0 && items.length}
                    </div>
                </div>
                <div className="w-full px-4 py-5 rounded-lg shadow">
                    <div className="text-sm font-medium truncate">
                        Latest Products
                    </div>
                    <div className="mt-1 text-3xl font-semibold">
                        {latestItems && latestItems.length > 0 && latestItems.length}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Hompage