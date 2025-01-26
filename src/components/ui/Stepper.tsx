import {Button, cn} from "rael-ui";
import {ChevronLeft, ChevronRight} from "lucide-react";

type StepperProps = {
    onNext?: () => void;
    onPrevious?: () => void;
    className?: string;
    disabled?: {
        nextButton?: boolean;
        prevButton?: boolean;
    };
    end?: boolean
}
const Stepper = ({onNext, onPrevious, className, disabled, end}: StepperProps) => {
    
    return (
        <div className={cn("flex items-center justify-between w-full", className)}>
            <Button disabled={disabled?.prevButton} onClick={onPrevious} variant={'ghost'}><ChevronLeft size={20}/> Previous</Button>
            <Button disabled={disabled?.nextButton} onClick={onNext}>{end ? 'Done' : 'Next'} <ChevronRight size={20}/> </Button>
        </div>
    );
};

export default Stepper;