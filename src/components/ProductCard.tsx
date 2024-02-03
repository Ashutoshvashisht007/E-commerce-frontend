import { FaPlus } from "react-icons/fa"
import { backend } from "../redux/store"
import { cartItems } from "../types/types"

interface ProductsComponent {
  productId: string,
  photo: string,
  name: string,
  price: number,
  stock: number,
  handler: (cartItem: cartItems)=> string | undefined;
}

const ProductCard: React.FC<ProductsComponent> = ({ photo, name, price, stock, productId, handler}) => {

  return (
    <div className="homeProduct">
      <img className="homeProductIMG" src={`${backend}/${photo}`} alt={name} />
      <h3 className="homeProductTitle">{name}</h3>
      <span className="homeProductPrice">${price}</span>

      <div className="productBtn">
        <button onClick={()=> handler({
          name,
          price,
          photo,
          productId,
          quantity: 1,
          stock
      
        })}><FaPlus/></button>
      </div>
    </div>
  )
}

export default ProductCard