import {
    Button,
    Card,
    CardSection,
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    PasswordInput,
    Stack,
    TextInput,
    useForm,
    ValidationRules
} from "rael-ui";
import {Bot} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {createUser} from "@/api/usersApi.ts";


export type FormType = {
    email: string;
    password: string;
    username: string;
    confirm: string;
}


const Register = () => {
    const navigate = useNavigate();
    const {mutateAsync: CreateUserMutation} = useMutation({
        mutationFn: createUser,
        onSuccess: data => {
            
            navigate('/login')
        }
    })
    const validations: ValidationRules<FormType>[] = [
        {
            name: "email",
            required: true,
            pattern: /^(?![._-])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please, enter a valid email address.",
        },
        {
            name: 'password',
            required: true,
            pattern: /^[\da-z.-_%+-]{4,}$/i,
            message: 'Password must be at least 4 characters long'
        },
        {
            name: 'confirm',
            required: true,
            valid: ({confirm, password}) => confirm === password,
            message: 'Password does not match'
        },
        {
            name: 'username',
            required: true,
            pattern: /^[a-zA-Z0-9.-]{3,}$/,
            message: 'Name must be at least 3 characters long',
        }
    ]
    const form = useForm<FormType>({
        defaultValue: {
            email: "",
            password: "",
            username: "",
            confirm: "",

        },
        validations
    })

    const formData = form.formData

    const handleSubmit = async () => {
        await CreateUserMutation({
            password: formData.password,
            email: formData.email,
            username: formData.username,
        })
    }

    return (
        <Stack className={'p-10 absolute top-20 left-1/2 -translate-x-1/2 space-y-6'}>
            <Stack gap={0}>
                <h1 className={'text-big-title font-md text-black dark:text-white flex gap-2 items-center'}>
                    <Bot size={40}/>
                    <span>Rael AI</span>
                </h1>
                <h1 className={'text-lead  text-black/80 dark:text-white/80 flex gap-2 items-center'}>
                    <span>Discover the power of local AIs</span>
                </h1>
            </Stack>
            <Form onSubmit={handleSubmit} form={form}>
                <Card className={'dark:bg-white/5 dark:border-none rounded-xl w-[380px]'}>
                    <CardSection>
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl name={'username'} render={(fields) => (
                                <TextInput block radius={'xl'} placeholder={'Enter your username'} {...fields}/>
                            )} type={'input'}/>
                            <FormMessage name={'username'}/>
                        </FormItem>
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
                                <PasswordInput placeholder={'Enter you password'} block radius={'xl'}
                                               className={'dark:bg-input-fill-d-bg'} {...fields}/>
                            )} type={'input'}/>
                            <FormMessage name={'password'}/>
                        </FormItem>
                        <FormItem>
                            <FormLabel>Confirm</FormLabel>
                            <FormControl name={'confirm'} render={(fields) => (
                                <PasswordInput placeholder={'Confirm you password'} block radius={'xl'}
                                               className={'dark:bg-input-fill-d-bg'} {...fields}/>
                            )} type={'input'}/>
                            <FormMessage name={'confirm'}/>
                        </FormItem>
                    </CardSection>
                    <CardSection>
                        <Button block radius={'xl'} loading={form.isSubmitting}
                                disabled={form.isSubmitting}>Login</Button>
                        <div className={'text-small-1 text-black/80 dark:text-white/40 flex gap-1'}>
                            <p className={''}>
                               Have an account ?
                            </p>
                            <span onClick={() => navigate('/login')} className={'text-black dark:text-white cursor-pointer underline'}>Login</span>
                        </div>
                    </CardSection>
                </Card>
            </Form>
        </Stack>
    );
};

export default Register;