import Image from 'next/image';
import React from 'react';


// location item
// prop type for location item
type IProps = {
  img:string;
  title:string;
  add:string;
  phone:string;
  email:string;
  open:string;
} 
function LocationItem({img,title,add,phone,email,open}:IProps) {
  return (
     <div className="tplocation__item d-flex align-items-center">
        <div className="tplocation__img mr-20">
          <Image src={`/assets/img/banner/contact-bg-${img}.jpg`} alt="contact-img" width={300} height={180} style={{height: 'auto'}}/>
        </div>
        <div className="tplocation__text">
          <h4 className="tplocation__text-title">{title}</h4>
          <div className="tplocation__content tplocation__content-two">
              <ul>
                <li>
                    <a href="#">Add: {add}</a>
                </li>
                <li>
                    <a href="tel:012345678">Phone: {phone}</a>
                </li>
                <li>
                    <a href="mailto:Muhal Cart@google.com">Email: {email}</a>
                </li>
                <li>
                    Opening Hours: <span> {open}</span>
                </li>
              </ul>
          </div>
        </div>
    </div>
  )
}

const LocationArea = () => {
  return (
    <section className="location-area pt-80 pb-45">
    <div className="container">
       <div className="row">
          <div className="col-lg-6">
             <div className="tplocation__wrapper mb-30">
              <LocationItem 
                img="1" 
                title="Muhal Cart Head Office - Churu" 
                add="Churu is a city in the Sekhawati region of Rajasthan state of India" 
                phone="+91 8005753265" 
                email="manishmuhal89@gmail.com" 
                open="09:10 AM - 06:10 PM" 
              />
             </div>
          </div>
          <div className="col-lg-6">
             <div className="tpcontactmap mb-30">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56417.84277717468!2d74.93175283737525!3d28.29486259021873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39136200b18a66a3%3A0x3e487bf6934c8306!2sChuru%2C%20Rajasthan%20331001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" style={{border:0}} loading="lazy" width="600" height="450"></iframe>
             </div>
          </div>
       </div>
    </div>
 </section>
  );
};

export default LocationArea;