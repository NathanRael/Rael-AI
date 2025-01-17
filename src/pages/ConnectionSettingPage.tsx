import {
    Button,
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    TextInput,
    useForm,
    ValidationRules
} from "rael-ui";
import {emailMessage, emailPattern} from "@/constants/validations.ts";


type FormType = {
    remoteConnection: string;
}
const ConnectionSettingPage = () => {
    
    const validations: ValidationRules<FormType>[] = [
        {
            name: 'remoteConnection',
            required: true,
            pattern: emailPattern,
            message: emailMessage
        }
    ]

    const form = useForm<FormType>({
        defaultValue: {
            remoteConnection: ""
        },
        validations
    })
    return (
        <div className={'setting-page-section'}>
            <div className={'w-full'}>
                <h1 className={'text-title text-black-100 dark:text-white-100 font-bold'}>Connection</h1>
                <p className={'text-base text-black-100 dark:text-white-100/80'}>Setup a remote connection (the server you want to access) </p>
            </div>
            <Form className={'flex flex-col items-start justify-start gap-6'} form={form}
                  onSubmit={() => {}}>
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
