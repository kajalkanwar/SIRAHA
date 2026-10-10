import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../hooks/useCart";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const { openCart } = useCart();

  useEffect(() => {
    openCart();

    if (location.pathname === "/cart") {
      navigate("/", { replace: true });
    }
  }, [openCart, navigate, location.pathname]);

  return null;
}

export default Cart;