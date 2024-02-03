import React from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Link } from 'react-router-dom';
import { backend } from '../redux/store';
import { cartItems } from '../types/types';

interface CartItemContainer {
  cartItem: cartItems;
  incrementhandler: (cartItem: cartItems) => string | undefined;
  decrementhandler: (cartItem: cartItems) => string | undefined;
  removehandler: (id: string) => void;
}

const CartItem: React.FC<CartItemContainer> = ({ cartItem, incrementhandler, decrementhandler, removehandler}) => {

  return (
    <div className='cartProductsLeft'>
      <div className="cartProductDetails">
        <img src={`${backend}/${cartItem.photo}`} alt={cartItem.name} />
        <div className="cartProductDesc">
          <Link to={`/product/${cartItem.productId}`}>
            <span className="cartProductTitle">{cartItem.name}</span>
          </Link>
          <h3 className="cartProductPrice">${cartItem.price}</h3>
        </div>
      </div>
      <div className="cartButtons">
        <button className="cartButton" onClick={() => decrementhandler(cartItem)}>
          <FaMinus />
        </button>
        <span>{cartItem.quantity}</span>
        <button className="cartButton" onClick={() => incrementhandler(cartItem)}>
          <FaPlus />
        </button>
        <button className="cartButtonDel" onClick={()=> removehandler(cartItem.productId)}>
          <MdDelete className="cartButtonDelete" />
        </button>
      </div>
    </div>
  )
}

export default CartItem