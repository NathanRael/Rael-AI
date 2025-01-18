import {
    Button,
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage, Icon,
    TextInput,
    useForm,
    ValidationRules
} from "rael-ui";
import {useConnection} from "@/hooks/useConnection.ts";
import {ChevronLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";


type FormType = {
    remoteConnection: string;
}
const ConnectionSettingPage = ({withBackBtn}: { withBackBtn: boolean }) => {
    const navigate = useNavigate();
    const {serverUrl, updateServerUrl} = useConnection()
    const validations: ValidationRules<FormType>[] = [
        {
            name: 'remoteConnection',
            required: true,
            pattern: /http:\/\/[a-z0-9._-]+/i,
            message: "Invalid server url",
        }
    ]

    const form = useForm<FormType>({
        defaultValue: {
            remoteConnection: serverUrl,
        },
        validations
    })


    const handleSubmit = async () => {
        updateServerUrl(form.formData.remoteConnection);
    }

    return (
        <div className={'setting-page-section'}>
            <div className={'w-full'}>
                <div className={'flex flex-row items-center justify-start gap-2'}>
                    {
                        withBackBtn && <Icon onClick={() => navigate(-1)} size={'sm'} variant={'ghost'}>
                            <ChevronLeft size={24}/>
                        </Icon>
                    }
                    <h1 className={'text-title text-black-100 dark:text-white-100 font-bold'}>Connection</h1>
                </div>
                <p className={'text-base text-black-100 dark:text-white-100/80'}>Setup a remote connection (the server
                    you want to access) </p>
            </div>
            <Form className={'flex flex-col items-start justify-start gap-6'} form={form}
                  onSubmit={handleSubmit}>
                <FormItem>
                    <FormLabel>Server </FormLabel>
                    <FormControl name={'remoteConnection'} render={({...fields}) => (
                        <TextInput block radius={'xl'} placeholder={'ex : 192.168.10.3:8080'} {...fields}/>
                    )} type={'input'}/>
                    <FormMessage name={'remoteConnection'}/>
                </FormItem>
                <Button disabled={false} type={'submit'}
                        radius={'xl'}>Change</Button>
            </Form>
        </div>
    )
}
export default ConnectionSettingPage
