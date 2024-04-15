const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({children}){

    const[cartProducts,setCartProducts] = useState([]);
    const ls = typeof window !== "undefined" ? window.localStorage : null;

    useEffect(() => {
        if(cartProducts?.length > 0 ){
            ls?.setItem('cart',JSON.stringify(cartProducts));
        }
    },[cartProducts])
    
    useEffect(() => {
        if(ls && ls.getItem('cart')){
            setCartProducts(JSON.parse(ls?.getItem('cart')))
        }
    },[])

    function addProduct(productId){
        setCartProducts((prev) => [...prev,productId]);
        
    }
    function removeProduct(productId){
        setCartProducts( prev => {
            const productIdx = prev.indexOf(productId);
            if(productIdx !== -1){
                return prev.filter((val,index) => index !== productIdx)
            } else{
                return prev;
            }
        })
    }

    function clearCart(){
        localStorage.removeItem('cart');
        setCartProducts([]);
    }

    return(
        <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart}}>
            {children}
        </CartContext.Provider>
    )
}