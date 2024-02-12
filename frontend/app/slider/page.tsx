'use client';

import Image from 'next/image';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
// import './index.scss';

const SliderComponent = () => {
    return (
        <Splide
            aria-label="My Favorite Images"
            className="slider"
            options={{
                type: 'loop',
                perPage: 3,
                perMove: 3,
                gap: '1rem',
                pagination: false,
                arrows: true,
                drag: 'free',
            }}
        >
            <SplideSlide>
                <Image
                    src="/logo.png"
                    alt="slider"
                    height={200}
                    width={200}
                    className="slider-image"
                />
            </SplideSlide>
            <SplideSlide>
                <Image
                    src="/item6.jpg"
                    alt="slider"
                    height={200}
                    width={200}
                    className="slider-image"
                />
            </SplideSlide>
            <SplideSlide>
                <Image
                    src="/back1.jpg"
                    alt="slider"
                    height={200}
                    width={200}
                    className="slider-image"
                />
            </SplideSlide>
            <SplideSlide>
                <Image
                    src="/item6.jpg"
                    alt="slider"
                    height={200}
                    width={200}
                    className="slider-image"
                />
            </SplideSlide>
            <SplideSlide>
                <Image
                    src="/back2.jpg"
                    alt="slider"
                    height={200}
                    width={200}
                    className="slider-image"
                />
            </SplideSlide>
        </Splide>
    );
};

export default SliderComponent;
