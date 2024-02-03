import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import countryList from 'react-select-country-list'
import { cartReducerInitialState } from "../types/reducer_types"
import axios from "axios"
import { backend } from "../redux/store"
import toast from "react-hot-toast"
import { saveShippingInfo } from "../redux/reducer/cartReducer"

const Shipping = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {cartItems, total} = useSelector((state: {cartReducer: cartReducerInitialState})=> state.cartReducer);

    const [shippingInfo,setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    const changeHandler = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        setShippingInfo((prev) => ({...prev, [e.target.name] : e.target.value}))
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(saveShippingInfo(shippingInfo));

        try {
            const {data} = await axios.post(`${backend}/api/v1/payment/create`,{
                amount: total,
                // shippingInfo,
            },
            {
                headers:{
                    "Content-Type":"application/json"
                },
            });

            navigate("/pay",{
                state: data.clientSecret,
            })
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    }

    const options = useMemo(()=> countryList().getData(),[]);

    useEffect(() => {
        if(cartItems.length <= 0) return navigate("/cart");
    }, [cartItems])
    

  return (
    <div className="shipping">
        <button className="shippingBtn" onClick={()=> navigate("/cart")}>
            <BiArrowBack/>
        </button>
        <form className="shippingForm" onSubmit={submitHandler}>
            <h1 className="shippingTitle">SHIPPING ADDRESS</h1>
            <input 
                required
                type="text" 
                placeholder="Address" 
                name="address"
                value={shippingInfo.address}
                onChange={changeHandler}
            />
            <input 
                required
                type="text" 
                placeholder="City" 
                name="city" 
                value={shippingInfo.city}
                onChange={changeHandler}
            />
            <input 
                required
                type="text" 
                placeholder="State" 
                name="state"
                value={shippingInfo.state}
                onChange={changeHandler}    
            />
           <select name="country" required
           value={shippingInfo.country} onChange={changeHandler}>
            <option value="">Choose Country</option>
            {
                options.map((e)=>(
                    <option key={e.value} value={e.label}>{e.label}</option>
                ))
            }
           </select>
            <input 
                required
                type="number" 
                placeholder="Pin Code" 
                name="pincode"
                value={shippingInfo.pincode}
                onChange={changeHandler}
            />
            <button type="submit" className="shippingSubmitBtn">PAY NOW</button>
        </form>

    </div>
  )
}

export default Shipping