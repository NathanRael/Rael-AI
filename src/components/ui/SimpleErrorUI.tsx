import {CircleAlert} from "lucide-react";

const SimpleErrorUi = ({error} : {error : string}) => {
    return (
        <div
            className={'text-danger flex flex-row items-center justify-start gap-2 text-small bg-danger/10 p-2 rounded-xl w-full '}>
            <CircleAlert size={20}/>
            <p>{error}</p>
        </div>
    );
};

export default SimpleErrorUi;