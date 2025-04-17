import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Country, State } from "country-state-city";
import { saveShippingInfo } from '../redux/actions/cartActions';

const Shipping = () => {

    const { shippingInfo } = useSelector((state) => state.cart);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [address, setaddress] = useState(shippingInfo?.address);
    const [country, setcountry] = useState(shippingInfo?.country);
    const [state, setstate] = useState(shippingInfo?.state);
    const [city, setcity] = useState(shippingInfo?.city);
    const [pinCode, setpinCode] = useState(shippingInfo?.pinCode);
    const [phoneNo, setphoneNo] = useState(shippingInfo?.phoneNo);


    const shippingSubmitHandler = async (e) => {
        e.preventDefault();

        dispatch(
            saveShippingInfo({ address, country, state, city, pinCode, phoneNo })
        );


        navigate("/confirmorder");
    };

    useEffect(() => {
        JSON.parse(localStorage.getItem("shippingInfoEcommerce"));
    }, []);




    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Shipping Info
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={shippingSubmitHandler}>
                            <div>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" type="text"
                                    placeholder="City"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setcity(e.target.value)}
                                    required />
                            </div>
                            <div>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 " type="text"
                                    placeholder="Address"
                                    name="address"
                                    value={address}
                                    onChange={(e) => setaddress(e.target.value)}
                                    required />
                            </div>
                            <div>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 "
                                    type="number"
                                    placeholder="Pin Code"
                                    name="pinCode"
                                    value={pinCode}
                                    onChange={(e) => setpinCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                    type="number"
                                    placeholder="Phone Number"
                                    name="phoneNo"
                                    value={phoneNo}
                                    onChange={(e) => setphoneNo(e.target.value)}
                                    required
                                    size={"11"}
                                />
                            </div>
                            <div>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                    value={country}
                                    onChange={(e) => setcountry(e.target.value)}
                                    required
                                >
                                    <option value="">Country</option>
                                    {Country &&
                                        Country.getAllCountries().map((i) => (
                                            <option value={i.isoCode} key={i.isoCode}>
                                                {i.name}
                                            </option>
                                        ))}
                                </select>

                            </div>

                            {
                                country && <div>

                                    <select
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                                        value={state}
                                        onChange={(e) => setstate(e.target.value)}
                                        required
                                    >
                                        <option value="">State</option>
                                        {State &&
                                            State.getStatesOfCountry(country).map((i) => (
                                                <option value={i.isoCode} key={i.isoCode}>
                                                    {i.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            }
                            <button type="submit" className="w-full text-white bg-black hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Continue</button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Shipping