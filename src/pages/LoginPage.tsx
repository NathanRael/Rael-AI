import {
    Button,
    Card,
    CardSection,
    Checkbox,
    CheckboxLabel,
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage, Icon,
    PasswordInput,
    Stack,
    TextInput,
    useForm,
    ValidationRules
} from "rael-ui";
import {Bot, Settings} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {loginUser} from "@/api/authApi.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {BackendErrorResponse} from "@/api/baseApi.ts";
import SimpleErrorUI from "@/components/ui/SimpleErrorUI.tsx";
import {createPortal} from "react-dom";

export type FormType = {
    email: string;
    password: string;
}

const LoginPage = () => {
    const updateToken = useAuthStore(state => state.updateToken);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {mutateAsync: LoginMutationAsync} = useMutation({
        mutationFn: loginUser,
        onSuccess: data => {
            updateToken(data.access_token)
            navigate('/')
        },
        onError: error => {
            // console.log("Error", (error as BackendErrorResponse).response.data.detail)
            setError((error as BackendErrorResponse).response?.data?.detail);
            // setTimeout(() => setError(''), 2000)
        }
    })
    const validations: ValidationRules<FormType>[] = [
        {
            name: "email",
            required: true,
            // pattern : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        {
            name: 'password',
            required: true
        }
    ]
    const form = useForm<FormType>({
        defaultValue: {
            email: "",
            password: "",
        },
        validations
    })

    const formData = form.formData


    useEffect(() => {
        setError('')
    }, [formData]);


    const handleSubmit = async () => {
        await LoginMutationAsync({
            password: formData.password,
            email: formData.email
        })
    }
    return (
        <Stack className={'p-10 absolute top-20 left-1/2 -translate-x-1/2 space-y-6'}>
            {
                createPortal(<Icon onClick={() => navigate('/serverSetting')} variant={'ghost'} className={'absolute top-10 right-10'}>
                    <Settings/>
                </Icon>, document.body)
            }
            <Stack gap={0}>
                <h1 className={'text-big-title font-md text-black dark:text-white flex gap-2 items-center'}>
                    <Bot size={40}/>
                    <span>Rael AI</span>
                </h1>
                <h1 className={'text-lead  text-black/80 dark:text-white/80 flex gap-2 items-center'}>
                    <span>Discover the power of local AIs</span>
                </h1>
            </Stack>
            {
                error && (
                    <SimpleErrorUI error={error}/>
                )
            }
            <Form onSubmit={handleSubmit} form={form}>
                <Card className={'dark:bg-white/5 dark:border-none rounded-xl w-[380px]'}>
                    <CardSection>
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl name={'email'} render={(fields) => (
                                <TextInput block radius={'xl'} placeholder={'Ex : rael@gmail.com'} {...fields}/>
                            )} type={'input'}/>
                            <FormMessage name={'email'}/>
                        </FormItem>
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl name={'password'} render={(fields) => (
                                <PasswordInput placeholder={'Enter you password'} block radius={'xl'}  {...fields}/>
                            )} type={'input'}/>
                            <FormMessage name={'password'}/>
                        </FormItem>
                        <FormItem>
                            <FormControl name={'remember'} render={(fields) => (
                                <Checkbox size={'sm'} radius={'md'} className={'dark:bg-input-fill-d-bg'} {...fields}>
                                    <CheckboxLabel>Remember me</CheckboxLabel>
                                </Checkbox>
                            )} type={'input'}/>
                            <FormMessage name={'remember'}/>
                        </FormItem>
                    </CardSection>
                    <CardSection>
                        <Button block radius={'xl'} loading={form.isSubmitting}
                                disabled={form.isSubmitting}>Login</Button>
                        <div className={'text-small-1 text-black/80 dark:text-white/40 flex gap-1'}>
                            <p className={''}>
                                Don't have an account ?
                            </p>
                            <span onClick={() => navigate('/register')}
                                  className={'text-black dark:text-white cursor-pointer underline'}>Create one</span>
                        </div>
                    </CardSection>
                </Card>
            </Form>
        </Stack>
    );
};

export default LoginPage;