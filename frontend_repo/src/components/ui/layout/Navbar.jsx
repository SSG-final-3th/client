import { MdOutlineShoppingBag } from "react-icons/md";
import { Link } from "react-router-dom";
import CartStatus from "../cart/CartStatus";

export default function Navbar() {
  return (
    <>
      <header className="flex justify-between border-b border-gray-300 p-2">
        <Link to="/" className="flex items-center text-4xl text-brand">
          <MdOutlineShoppingBag />
          <h1>OF MART</h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/products">Products</Link>
          <Link to="/carts">
            <CartStatus />
          </Link>
        </nav>
      </header>
    </>
  );
}

/*
const { user, login, logout } = useAuthContext();
  //구조 분해 할당을 통해서 3가지 요소를 커스텀 훅인 useAuthContext를 통해서 가져온다
  return (
    <header className="flex justify-between border-b border-gray-300 p-2">
      <Link to="/" className="flex items-center text-4xl text-brand">
        <FiShoppingBag />
        <h1>Shoppy</h1>
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/products">Products</Link>
        {user && user.isAdmin && (
          <Link to="/carts">
            <CartStatus />
          </Link>
        )}
        {user && user.isAdmin && (
          <Link to="products/new" className="text-2xl">
            <BsFillPencilFill />
          </Link>
        )}
        {user && <User user={user} />}
        {!user && <Button text={"Login"} onClick={login} />}
        {user && <Button text={"Logout"} onClick={logout} />}
      </nav>
    </header>
    */
