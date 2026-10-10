import { useEffect, useState } from "react";

import CartContext from "./CartContext";

const CartProvider = ({ children }) => {
  // ============================================================
  // LOAD CART FROM LOCAL STORAGE
  // ============================================================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem("sirrahaCart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error
      );

      return [];
    }
  });

  // ============================================================
  // CART DRAWER STATE
  // ============================================================

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // ============================================================
  // SAVE CART TO LOCAL STORAGE
  // ============================================================

  useEffect(() => {
    localStorage.setItem(
      "sirrahaCart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ============================================================
  // OPEN CART
  // ============================================================

  const openCart = () => {
    setIsCartOpen(true);
  };

  // ============================================================
  // CLOSE CART
  // ============================================================

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // ============================================================
  // ADD TO CART
  // ============================================================

  const addToCart = (product, size) => {
    setCartItems((previousItems) => {
      const existingItem =
        previousItems.find(
          (item) =>
            item._id === product._id &&
            item.size === size
        );

      if (existingItem) {
        return previousItems.map((item) =>
          item._id === product._id &&
          item.size === size
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...product,
          size,
          quantity: 1,
        },
      ];
    });

    // Open bag automatically after adding
    setIsCartOpen(true);
  };

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeFromCart = (
    productId,
    size
  ) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) =>
          !(
            item._id === productId &&
            item.size === size
          )
      )
    );
  };

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  const increaseQuantity = (
    productId,
    size
  ) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item._id === productId &&
        item.size === size
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // ============================================================
  // DECREASE QUANTITY
  // ============================================================

  const decreaseQuantity = (
    productId,
    size
  ) => {
    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item._id === productId &&
          item.size === size
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ============================================================
  // CLEAR CART
  // ============================================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ============================================================
  // TOTAL ITEM COUNT
  // ============================================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + (item.quantity || 0),
    0
  );

  // ============================================================
  // GET ITEM PRICE
  // ============================================================

  const getItemPrice = (item) => {
    if (
      item.isOnSale &&
      item.salePrice !== null &&
      item.salePrice !== undefined
    ) {
      return Number(item.salePrice);
    }

    return Number(item.price || 0);
  };

  // ============================================================
  // CART TOTAL
  // ============================================================

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      getItemPrice(item) *
        (item.quantity || 0),
    0
  );

  // ============================================================
  // CART PROVIDER
  // ============================================================

  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,
        removeFromCart,

        increaseQuantity,
        decreaseQuantity,

        clearCart,

        cartCount,
        cartTotal,

        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;