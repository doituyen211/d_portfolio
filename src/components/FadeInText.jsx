'use client';

import React, { useRef, useEffect, useState } from 'react';

const FadeInText = ({
    children,               // Dùng children để tối ưu SEO và LCP
    className = '',
    startDelay = 4200,      // Thời gian chờ preloader (ms)
    duration = 1.5,         // Thời gian mờ dần lên (s) - 1.5s rất sang trọng
    yOffset = 20,           // Khoảng cách trượt từ dưới lên (px)
    useScrollTrigger = false,
    threshold = 0.1,
    textAlign = 'center',
    tag = 'p',
}) => {
    const containerRef = useRef(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    useEffect(() => {
        // Load GSAP linh hoạt
        const loadGSAP = () => {
            if (window.gsap) {
                if (useScrollTrigger && !window.ScrollTrigger) {
                    const stScript = document.createElement('script');
                    stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                    stScript.onload = () => {
                        window.gsap.registerPlugin(window.ScrollTrigger);
                        setGsapLoaded(true);
                    };
                    document.head.appendChild(stScript);
                } else {
                    setGsapLoaded(true);
                }
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
                script.onload = () => {
                    if (useScrollTrigger) {
                        const stScript = document.createElement('script');
                        stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                        stScript.onload = () => {
                            window.gsap.registerPlugin(window.ScrollTrigger);
                            setGsapLoaded(true);
                        };
                        document.head.appendChild(stScript);
                    } else {
                        setGsapLoaded(true);
                    }
                };
                document.head.appendChild(script);
            }
        };

        loadGSAP();
    }, [useScrollTrigger]);

    useEffect(() => {
        if (!gsapLoaded || !containerRef.current) return;

        const gsap = window.gsap;
        const el = containerRef.current;

        const ctx = gsap.context(() => {
            // Thiết lập trạng thái ban đầu: Ẩn và tụt xuống dưới một chút
            gsap.set(el, { opacity: 0, y: yOffset });

            const animProps = {
                opacity: 1,
                y: 0,
                duration: duration,
                ease: 'power3.out',
                delay: startDelay / 1000,
            };

            // Tích hợp cuộn chuột nếu cần
            if (useScrollTrigger && window.ScrollTrigger) {
                animProps.scrollTrigger = {
                    trigger: el,
                    start: `top ${(1 - threshold) * 100}%`,
                    once: true,
                };
                // Nếu dùng cuộn chuột thì huỷ bỏ delay để hiện ngay khi cuộn tới
                if (startDelay === 4200) animProps.delay = 0;
            }

            gsap.to(el, animProps);

        }, containerRef);

        return () => ctx.revert();
    }, [gsapLoaded, duration, startDelay, useScrollTrigger, threshold, yOffset]);

    const Tag = tag;

    return (
        <Tag
            ref={containerRef}
            className={className}
            style={{
                textAlign,
                opacity: 0, // Tránh hiện tượng chớp nháy (FOUC) trước khi JS chạy
                willChange: 'opacity, transform' // Báo trước cho trình duyệt để tối ưu render
            }}
        >
            {children}
        </Tag>
    );
};

export default FadeInText;