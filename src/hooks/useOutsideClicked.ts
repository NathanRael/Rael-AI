import { RefObject, useCallback, useEffect} from "react";

type useOutsideClickedProps = {
    ref: RefObject<HTMLDivElement>,
    action : CallableFunction,
}
const useOutsideClicked = ({ref, action} : useOutsideClickedProps) => {

    const handleOutsideClicked = useCallback((e: Event) => {
        if (ref.current && !ref.current.contains(e.target as Element)) {
            action();
        }
    }, [ref, action])
    
    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClicked)
        return () => document.removeEventListener("mousedown", handleOutsideClicked)
    })
}

export default useOutsideClicked