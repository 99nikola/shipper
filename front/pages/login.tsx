import { ButtonGroup, Typography } from "@mui/material";
import { NextPage } from "next";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/atoms/Button";
import InputField from "../components/atoms/InputField";
import { PasswordRule, RequiredRule } from "../rules";
import Flex from "../components/atoms/Flex.styled";
import { loginUser } from "../store/User/UserActions";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../store";
import { ILogin, IUserState } from "../typescript";
import DivError from "../components/styled/DivError";
import { useRouter } from "next/router";
import { useCallback } from "react";

const onError: SubmitErrorHandler<ILogin> = (error) => {
    console.error(error);
}

const Login: NextPage = () => {
    
    const { isFetching, error } = useSelector<TRootState, IUserState>(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const form = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onValid: SubmitHandler<ILogin> = useCallback((credentials) => {
        dispatch(loginUser(credentials, () => router.replace({
            pathname: "/"
        })));
    }, [router]);

    const handleRedirect = useCallback(() => {
        router.replace({
            pathname: "/register"
        });
    }, [router]);


    return (
        <Flex direction="column" alignItems="center" gap="5px" margin="10vh 0 0 0">
            <Typography variant="h2">Shipper</Typography>

            <Typography variant="h4">Login</Typography>

            {error !== null && (
                <DivError>{error}</DivError>
            )}

            <form className="form-container" onSubmit={form.handleSubmit(onValid, onError)}>
                
                <Flex direction="column" gap="1rem" width="max-content">
                    <Controller 
                        name="username"
                        control={form.control}
                        rules={RequiredRule}
                        render={({ field, fieldState }) => (
                            <InputField 
                                {...field}
                                label="Username"
                                type="text"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller 
                        name="password"
                        control={form.control}
                        rules={PasswordRule}
                        render={({ field, fieldState }) => (
                            <InputField 
                                {...field}
                                type="password"
                                label="Password"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <ButtonGroup>
                        <Button
                            disabled={isFetching}
                            type="submit"
                            color="warning"
                            >
                            {isFetching ? "Loading" : "Login"} 
                        </Button>
                        <Button 
                            color="info"
                            disabled={isFetching}
                            onClick={handleRedirect}
                            >
                            Register insted
                        </Button>
                    </ButtonGroup>

                </Flex>
            </form>
        </Flex>
    );
}

export default Login;