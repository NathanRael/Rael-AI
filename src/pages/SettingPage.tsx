import {Button, Form, FormControl, FormItem, FormLabel, FormMessage, TextInput, useForm} from "rael-ui";
import {QueryClient, useMutation, useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {fetchActiveUser, updateUser} from "@/api/usersApi.ts";
import {useEffect} from "react";
import {emailMessage, emailPattern, usernameMessage, usernamePattern} from "@/constants/validations.ts";

type FormType = {
    username: string;
    email: string;
}
const SettingPage = () => {
    const {data: user, isLoading} = useQuery({
        queryFn: () => fetchActiveUser(),
        queryKey: [queryKeys.users]
    })
    
    const queryClient = new QueryClient();
    
    const {mutateAsync : updateUserMutation} = useMutation({
        mutationFn : updateUser,
        onSuccess : () => queryClient.invalidateQueries([queryKeys.users])
    })

    const form = useForm<FormType>({
        defaultValue: {
            username: user?.username || '',
            email: user?.email || ''
        },
        validations: [{
            name: 'email',
            required: true,
            pattern: emailPattern,
            message: emailMessage
        },
            {
                name: 'username',
                required: true,
                pattern: usernamePattern,
                message: usernameMessage,
            }]
    })
    
    const submitDisabled = form.formData.email === '' ||  form.formData.username === '' || form.isSubmitting;


    const handleSubmit = async () => {
        const formData = form.formData;
        await updateUserMutation({
            id : user?.id,
            username : formData.username,
            email : formData.email,
        })
    }

    useEffect(() => {
        //TODO : Set form values
    }, [user, isLoading])

    return (
        <div className={'p-6 pt-20'}>
            <h1 className={'text-title text-black-100 dark:text-white-100 font-bold'}>Settings</h1>
            <Form className={'flex flex-col items-start justify-start gap-6'} form={form} onSubmit={handleSubmit}>
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl name={'username'} render={(fields) => (
                        <TextInput block radius={'xl'} placeholder={'Your username'} {...fields}/>
                    )} type={'input'}/>
                    <FormMessage name={'username'}/>
                </FormItem>
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl name={'email'} render={(fields) => (
                        <TextInput block radius={'xl'} placeholder={'Your email'} {...fields}/>
                    )} type={'input'}/>
                    <FormMessage name={'email'}/>
                </FormItem>
                <Button disabled={submitDisabled} type={'submit'} radius={'xl'}>Update Profile</Button>
            </Form>
        </div>
    );
};

export default SettingPage;