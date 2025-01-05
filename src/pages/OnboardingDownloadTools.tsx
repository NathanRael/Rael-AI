import {Button} from "rael-ui";
import {ExternalLink} from "lucide-react";
import Stepper from "@/components/ui/Stepper.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ollamaWebsite} from "../../env.ts";

const OnboardingDownloadTools = () => {
    const [hasClicked, setHasClicked] = useState(false);
    const navigate = useNavigate();
    
    return (
        <div className={"onboarding-page flex flex-col gap-6 h-screen w-full"}>
            <div className=" flex flex-col gap-10 ">
                <div className={'max-w-[600px]'}>
                    <h1 className={'text-black dark:text-white text-big-title font-bold'}>Download and Install
                        ollama</h1>
                    <p className={'text-lead text-black/80 dark:text-white/80'}>To get started, make sur to download and install
                        ollama</p>
                </div>
               
                <Button onClick={() => {
                    setHasClicked(true)
                    window.open(ollamaWebsite, '_blank');
                }} variant={'ghost'}
                        className={'p-0 underline hover:text-secondary-100  dark:hover:text-secondary-100 dark:hover:bg-transparent hover:bg-transparent'}>
                    Download in  official website
                    <ExternalLink size={20}/>
                </Button>
            </div>
            <Stepper disabled={{prevButton: true, nextButton: !hasClicked}}
                     onNext={() => navigate('/onboarding/chooseModel')} onPrevious={() => {
            }} className={'w-full mt-20'}/>
        </div>
    );
};

export default OnboardingDownloadTools;