import CartProductCard from "../components/cart/CartItemCard";
import { useCartContext } from "../hooks/useCartContext";

const Cart = () => {
  const { cart, clearCart } = useCartContext();

  const subtotals = cart.map((item) => item.product.price * item.quantity);
  const total = subtotals.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl font-semibold mb-4">Cart:</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <button
            onClick={clearCart}
            className="bg-blue-300 font-medium rounded text-white hover:bg-blue-500 transition py-2 px-2 cursor-pointer self-start"
          >
            Clear Cart
          </button>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex flex-col items-start">
                <CartProductCard
                  product={item.product}
                  quantity={item.quantity}
                />
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h3>
          <button className="bg-blue-300 font-medium rounded text-white hover:bg-blue-500 transition py-2 px-2 cursor-pointer self-start">
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
