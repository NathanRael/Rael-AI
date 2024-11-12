import {useEffect, useRef, useState} from "react";


const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    root: null,
    rootMargin: '0px'
}

const useInView = (options: IntersectionObserverInit) => {
    const [inView, setInView] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setInView(entry.isIntersecting)
            })
        }, {
            ...defaultOptions,
            ...options,
        })

        if (containerRef.current)
            observer.observe(containerRef.current)

        return () => {
            if (containerRef.current)
                observer.unobserve(containerRef.current)
        }
    }, [])

    return {inView, containerRef};
}

export default useInView;