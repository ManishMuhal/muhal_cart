'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CheckoutOrder from './checkout-order';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getCartProducts, clearCartSilent } from '@/redux/features/cart';
import Link from 'next/link';
import ErrorMsg from '../common/error-msg';
import useCartInfo from '@/hooks/use-cart-info';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


// type form data

type FormData = {
   firstName: string;
   lastName: string;
   company: string;
   country: string;
   address: string;
   city: string;
   apartment: string;
   state: string;
   zipCode: string;
   email: string;
   phone: string;
   orderNote?: string;
 };
 
 const schema = yup.object().shape({
   firstName: yup.string().required().label("First Name"),
   lastName: yup.string().required().label("Last Name"),
   company: yup.string().required().label("Company"),
   country: yup.string().required().label("Country"),
   address: yup.string().required().label("Address"),
   city: yup.string().required().label("City"),
   apartment: yup.string().required().label("Apartment"),
   state: yup.string().required().label("State"),
   zipCode: yup.string().required().label("Zip Code"),
   email: yup.string().required().email().label("Email"),
   phone: yup.string().required().min(4).label("Phone"),
   orderNote: yup.string().label("Order Note"),
 });

 
const CheckoutArea = () => {
   const { cart_products } = useAppSelector((state) => state.cart);
   const dispatch = useAppDispatch();
   const { total } = useCartInfo();
   const [shipCost,setShipCost] = useState<number | string>(7.00);
   const { userInfo } = useAppSelector((state) => state.auth);
   const router = useRouter();
 
   useEffect(() => {
     if (typeof window !== "undefined" && window.localStorage) {
       dispatch(getCartProducts());
     }
   }, [dispatch]);
 
   const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
     resolver: yupResolver(schema),
   });
   
   const onSubmit = handleSubmit(async (data) => {
     if (cart_products.length === 0) {
       toast.error("Your cart is empty");
       return;
     }

     const orderId = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
     const items = cart_products.map((p) => ({
       id: p.id,
       title: p.title,
       price: p.sale_price ? p.sale_price : p.price,
       quantity: p.orderQuantity || 1,
       thumbnail: p.image?.original || ''
     }));

     const totalAmount = typeof shipCost === 'number' ? (total + shipCost) : total;

     const payload = {
       orderId,
       user: userInfo?._id || null,
       items,
       shippingAddress: {
         name: `${data.firstName} ${data.lastName}`,
         phone: data.phone,
         address: `${data.address}, ${data.apartment || ''}`,
         city: data.city,
         country: data.country
       },
       paymentMethod: 'Direct Bank Transfer',
       totalAmount
     };

     try {
       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://muhalcartbackend-production.up.railway.app'}/api/v1/orders`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           ...(userInfo?.token ? { 'Authorization': `Bearer ${userInfo.token}` } : {})
         },
         body: JSON.stringify(payload),
       });

       const resData = await response.json();
       if (!response.ok) {
         throw new Error(resData.error || 'Failed to place order');
       }

       toast.success(`Order placed successfully! Order ID: ${orderId}`);
       dispatch(clearCartSilent());
       reset();
       router.push('/');
     } catch (err: any) {
       toast.error(err.message || 'Error occurred while placing order');
     }
   });
  return (
    <section className="checkout-area pb-50">
    <div className="container">
    {cart_products.length === 0 &&
            <div className='text-center pt-100'>
              <h3>Your cart is empty</h3>
              <Link href="/shop" className="tp-btn-2 mt-10">Return to shop</Link>
            </div>
          }
          {cart_products.length > 0 && 
            <form onSubmit={onSubmit}>
               <div className="row">
                     <div className="col-lg-6 col-md-12">
                        <div className="checkbox-form">
                           <h3>Billing Details</h3>
                           <div className="row">
                                 <div className="col-md-12">
                                    <div className="country-select">
                                       <label>Country <span className="required">*</span></label>
                                       <select id='country' {...register("country")}>
                                             <option defaultValue="united-states">United States</option>
                                             <option defaultValue="algeria">Algeria</option>
                                             <option defaultValue="canada">Canada</option>
                                             <option defaultValue="germany">Germany</option>
                                             <option defaultValue="england">England</option>
                                             <option defaultValue="qatar">Qatar</option>
                                             <option defaultValue="dominican-republic">Dominican Republic</option>
                                       </select>
                                       <ErrorMsg msg={errors.country?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="checkout-form-list">
                                       <label>First Name <span className="required">*</span></label>
                                       <input id='firstName' {...register("firstName")} type="text" placeholder="First Name" />
                                       <ErrorMsg msg={errors.firstName?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="checkout-form-list">
                                       <label>Last Name <span className="required">*</span></label>
                                       <input id='lastName' {...register("lastName")} type="text" placeholder="Last Name" />
                                       <ErrorMsg msg={errors.lastName?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-12">
                                    <div className="checkout-form-list">
                                       <label>Company Name</label>
                                       <input id='company' {...register("company")} type="text" placeholder="Company" />
                                       <ErrorMsg msg={errors.company?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-12">
                                    <div className="checkout-form-list">
                                       <label>Address <span className="required">*</span></label>
                                       <input id='address' {...register("address")} type="text" placeholder="Street address" />
                                       <ErrorMsg msg={errors.address?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-12">
                                    <div className="checkout-form-list">
                                       <input id='apartment' {...register("apartment")} type="text" placeholder="Apartment, suite, unit etc. (optional)" />
                                    </div>
                                 </div>
                                 <div className="col-md-12">
                                    <div className="checkout-form-list">
                                       <label>Town / City <span className="required">*</span></label>
                                       <input id='city' {...register("city")} type="text" placeholder="Town / City" />
                                       <ErrorMsg msg={errors.city?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="checkout-form-list">
                                       <label>State / County <span className="required">*</span></label>
                                       <input id='state' {...register("state")} type="text" placeholder="State" />
                                       <ErrorMsg msg={errors.state?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="checkout-form-list">
                                       <label>Postcode / Zip <span className="required">*</span></label>
                                       <input id='zipCode' {...register("zipCode")} type="text" placeholder="Postcode / Zip" />
                                       <ErrorMsg msg={errors.zipCode?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="checkout-form-list">
                                       <label>Email Address <span className="required">*</span></label>
                                       <input id='email' {...register("email")} type="email" placeholder="Email" />
                                       <ErrorMsg msg={errors.email?.message!} />
                                    </div>
                                 </div>
                                 <div className="col-md-6">
                                    <div className="checkout-form-list">
                                       <label>Phone <span className="required">*</span></label>
                                       <input id='phone' {...register("phone")} type="text" placeholder="Postcode / Zip" />
                                       <ErrorMsg msg={errors.phone?.message!} />
                                    </div>
                                 </div>
                           </div>
                           <div className="different-address">
                                 <div className="order-notes">
                                    <div className="checkout-form-list">
                                       <label>Order Notes</label>
                                       <textarea id='orderNote' {...register("orderNote")} cols={30} rows={10}
                                             placeholder="Notes about your order, e.g. special notes for delivery.">
                                        </textarea>
                                    </div>
                                 </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-6 col-md-12">
                        <div className="your-order mb-30 ">
                           <h3>Your order</h3>
                           <div className="your-order-table table-responsive">
                                 <table>
                                    <thead>
                                       <tr>
                                          <th className="product-name">Product</th>
                                          <th className="product-total">Total</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {cart_products && cart_products.map((product) => (
                                             <tr className="cart_item" key={product.id}>
                                                   <td className="product-name">
                                                      {product.title} <strong className="product-quantity"> 
                                                      × {product.orderQuantity}</strong>
                                                   </td>
                                                   <td className="product-total">
                                                      <span className="amount">₹{product.sale_price ? product.sale_price.toFixed(2) : product.price.toFixed(2)}</span>
                                                   </td>
                                             </tr>
                                       ))}
                                    </tbody>
                                    <tfoot>
                                       <tr className="cart-subtotal">
                                             <th>Cart Subtotal</th>
                                             <td><span className="amount">₹{total.toFixed(2)}</span></td>
                                       </tr>
                                       <tr className="shipping">
                                             <th>Shipping</th>
                                             <td>
                                                <ul>
                                                   <li>
                                                         <input onChange={()=> setShipCost(7.00)} checked={shipCost === 7.00} type="radio" id='shipping' name="shipping"/>
                                                         <label htmlFor='shipping'>
                                                            Flat Rate: <span className="amount">₹7.00</span>
                                                         </label>
                                                   </li>
                                                   <li>
                                                         <input id='free-shipping' onChange={()=> setShipCost('free')} type="radio" name="shipping"/>
                                                         <label htmlFor='free-shipping'>Free Shipping:</label>
                                                   </li>
                                                </ul>
                                             </td>
                                       </tr>
                                       <tr className="order-total">
                                             <th>Order Total</th>
                                             <td>
                                                <strong>
                                                   <span className="amount">
                                                      ₹{typeof shipCost === 'number' ? (total + shipCost).toFixed(2) : total.toFixed(2)}
                                                   </span>
                                                </strong>
                                             </td>
                                       </tr>
                                    </tfoot>
                                 </table>
                           </div>
                           <div className="payment-method">
                              {/* Checkout Order */}
                              <CheckoutOrder/>
                              {/* Checkout Order */}
                           </div>
                        </div>
                     </div>
               </div>
            </form>
         }
    </div>
 </section>
  );
};

export default CheckoutArea;