// dùng cho screen <lg , brake point theo tailwind sm48,md768

import {Swiper,SwiperSlide} from "swiper/react"

export default function Swipper(){
    return(
        <>
        <Swiper
        breakpoints={{
            0:{
                slidesPerView:2,
                spaceBetween:10
            },
            640:{
                slidesPerView:
            }
        }}
        slidesPerView={}>

        </Swiper>
        
        </>
    )
}