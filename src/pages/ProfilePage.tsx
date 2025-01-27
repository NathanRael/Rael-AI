import {
    Button,
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    TextInput,
    useForm,
    ValidationRules,
} from "rael-ui";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/api/queryKeys.ts";
import {fetchActiveUser, updateUser} from "@/api/usersApi.ts";
import {useEffect} from "react";
import {emailMessage, emailPattern, usernameMessage, usernamePattern} from "@/constants/validations.ts";

type FormType = {
    username: string;
    email: string;
}


const ProfilePage = () => {
    const {data: user, isLoading} = useQuery({
        queryFn: () => fetchActiveUser(),
        queryKey: [queryKeys.users]
    })

    const queryClient = useQueryClient();

    const {mutateAsync: updateUserMutation, isPending : submitting} = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : [queryKeys.users]})
        }
    })

    const validations: ValidationRules<FormType>[] = [
        {
            name: 'email',
            required: true,
            pattern: emailPattern,
            message: emailMessage
        }, {
            name: 'username',
            required: true,
            pattern: usernamePattern,
            message: usernameMessage,
        }
    ]

    const form = useForm<FormType>({
        defaultValue: {
            username: '',
            email: ""
        },
        validations
    })

    const submitDisabled = form.formData.email === '' || form.formData.username === '' || form.isSubmitting;


    const handleSubmit = async () => {
        const formData = form.formData;
        await updateUserMutation({
            id : user?.id,
            username : formData.username,
            email : formData.email,
        })
    }

    useEffect(() => {
        if (!user || isLoading) return
        form.setValue("username", user.username);
        form.setValue('email', user.email);
    }, [user, isLoading])

    return (
        <div className={'setting-page-section'}>
            <h1 className={'text-title text-black-100 dark:text-white-100 font-bold'}>Profile</h1>
            <Form className={'flex flex-col items-start justify-start gap-6'} form={form}
                  onSubmit={handleSubmit}>
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl name={'username'} render={({...fields}) => (
                        <TextInput block radius={'xl'} placeholder={'Your username'} {...fields}/>
                    )} type={'input'}/>
                    <FormMessage name={'username'}/>
                </FormItem>
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl name={'email'} render={({...fields}) => (
                        <TextInput block radius={'xl'} placeholder={'Your email'} {...fields}/>
                    )} type={'input'}/>
                    <FormMessage name={'email'}/>
                </FormItem>
                <Button disabled={submitDisabled} type={'submit'}
                        radius={'xl'}>{submitting ? 'Updating...' : 'Update Profile'}</Button>
            </Form>
        </div>
    );
};

export default ProfilePage;
