import { useState } from "react";
import axios from "axios";
import "./assets/style.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [account, setAccount] = useState({
    username: "",
    password: ""
  });
  
  const [isAuth, setIsAuth] = useState(false);
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]);

    const checkLogin = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];

      console.log(token);
      axios.defaults.headers.common.Authorization = token;
      
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      alert('使用者已登入');
    } catch (error) {
      console.error(error);
    }
  }

  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;

      document.cookie = `hexToken=${ token }; expires=${ new Date(expired) }`;
      axios.defaults.headers.common['Authorization'] = token;

      getProducts();

      setIsAuth(true);
    } catch (error) {
      alert('登出失敗: ' + error.response.data.message);
    }
  }

  return (
    <>
    {isAuth ? (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6">
            <button className="btn btn-danger mb-5" type="button" id="check" onClick={checkLogin}>確認是否登入</button>
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ?(
                  products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td>
                        <button
                          onClick={() => setTempProduct(product)}
                          className="btn btn-primary"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {tempProduct.title ? (
              <div className="card mb-3">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top primary-image"
                  alt={tempProduct.title}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge text-bg-primary ms-2">
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">商品描述：{tempProduct.description}</p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <div className="d-flex">
                    <p className="card-text">
                      <del>{tempProduct.origin_price} 元</del> / {tempProduct.price}{" "}元
                    </p>
                  </div>
                  <h5 className="mt-3">更多圖片：</h5>
                  {tempProduct.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="images" />)))}
                </div>
              </div>
            ) : (
              <p className="text-secondary">請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="container login">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="username" placeholder="name@example.com"
                  value={account.username} onChange={handleInputChange} required autoFocus />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input type="password" className="form-control" id="password" placeholder="Password" value={account.password}
                  onChange={handleInputChange} required />
                <label htmlFor="password">Password</label>
              </div>
              <button type="submit" className="btn btn-lg btn-primary w-100 mt-3">登入</button>
            </form>
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    )}
  </>
  )
}

export default App
