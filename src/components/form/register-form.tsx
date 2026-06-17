'use client'
import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from 'next/link';
import ErrorMsg from '../common/error-msg';
import { useAppDispatch } from '@/redux/hook';
import { registerUser } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const schema = yup.object().shape({
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
});

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {register,handleSubmit,reset,formState: { errors }} = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data:FormData) => {
    try {
      const resultAction = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Successfully registered and logged in!");
        router.push('/');
        reset();
      } else {
        toast.error((resultAction.payload as string) || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  });
  return (
    <form onSubmit={onSubmit}>
      <div className="tptrack__id mb-10">
        <div className="tpsign__input">
          <span>
          <i className="fal fa-user"></i>
          </span>
          <input id='name' {...register("name")} type="text" placeholder="User name" />
        </div>
        <ErrorMsg msg={errors.name?.message!} />
      </div>
      <div className="tptrack__id mb-10">
        <div className="tpsign__input">
          <span>
            <i className="fal fa-envelope"></i>
          </span>
          <input id='email' {...register("email")} type="email" placeholder="Email address" />
        </div>
        <ErrorMsg msg={errors.email?.message!} />
      </div>
      <div className="tptrack__email mb-10">
        <div className="tpsign__input">
          <span>
            <i className="fal fa-key"></i>
          </span>
          <input id='password' {...register("password")} type="password" placeholder="Password" />
        </div>
        <ErrorMsg msg={errors.password?.message!} />
      </div>
      <div className="tpsign__account mb-15">
        <Link href="/login">Already Have Account?</Link>
      </div>
      <div className="tptrack__btn">
        <button type="submit" className="tptrack__submition tpsign__reg">
          Register Now<i className="fal fa-long-arrow-right"></i>
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
