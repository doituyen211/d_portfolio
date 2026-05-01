'use client';

import React, { useEffect, useRef } from 'react';

export default function ScrollCta() {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const lineRef = useRef(null);
    const headLeftRef = useRef(null);
    const headRightRef = useRef(null);

    const strokeColor = "#ffffff";

    useEffect(() => {
        let ctx;

        const initAnimation = () => {
            const gsap = window.gsap;
            if (!gsap) return;

            ctx = gsap.context(() => {
                // Tiện ích để set dasharray chuẩn bị cho việc vẽ
                const setPath = (pathObj) => {
                    const len = pathObj.getTotalLength();
                    gsap.set(pathObj, { strokeDasharray: len, strokeDashoffset: len });
                };

                setPath(lineRef.current);
                setPath(headLeftRef.current);
                setPath(headRightRef.current);

                // Thiết lập trạng thái ban đầu của nhóm text (ẩn và hạ thấp xuống)
                gsap.set(textRef.current, { opacity: 0, y: 10 });
                gsap.set(containerRef.current, { opacity: 1 }); // Hiện container

                // Đợi 4 giây cho Preloader hoàn tất mới bắt đầu Timeline này
                const tl = gsap.timeline({ delay: 4.2 });

                // 1. Chữ "SCROLL" mờ ảo bay lên
                tl.to(textRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power2.out'
                })
                    // 2. Vẽ thân mũi tên kéo dài xuống
                    .to(lineRef.current, {
                        strokeDashoffset: 0,
                        duration: 1,
                        ease: 'power2.inOut'
                    }, "-=0.5") // Bắt đầu khi chữ SCROLL hiện được một nửa
                    // 3. VẼ HAI MŨI TÊN CÙNG LÚC
                    .to([headLeftRef.current, headRightRef.current], {
                        strokeDashoffset: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, "-=0.2") // Bắt đầu khi thân mũi tên sắp vẽ xong
                    // 4. Hiệu ứng bồng bềnh vô tận cho nguyên cụm
                    .to(containerRef.current, {
                        y: 8,
                        duration: 1,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut'
                    });
            }, containerRef);
        };

        // Chờ GSAP tải xong
        const checkGsap = setInterval(() => {
            if (window.gsap) {
                clearInterval(checkGsap);
                initAnimation();
            }
        }, 50);

        return () => {
            clearInterval(checkGsap);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0 z-10">
            {/* Chữ scroll tracking rộng, font nhỏ tinh tế */}
            <span ref={textRef} className="font-bold text-[#8E8E93] p-2 px-8 border tracking-wider uppercase text-sm">
                Scroll
            </span>

            {/* Mũi tên được tách ra làm 3 path riêng biệt */}
            <svg width="20" height="60" viewBox="0 0 15 68" fill="none" className="overflow-visible">
                {/* Thân mũi tên */}
                <path ref={lineRef} d="M7.9381 0V66.1354" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                {/* Mũi bên trái */}
                <path ref={headLeftRef} d="M7.9381 66.1354L0.438095 52.5" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                {/* Mũi bên phải */}
                <path ref={headRightRef} d="M7.9381 66.1354L14.4381 52.5" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}