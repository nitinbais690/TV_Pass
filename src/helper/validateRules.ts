import { object, string, mixed, addMethod } from 'yup';
import * as Yup from 'yup';
import { LoginInput } from 'interfaces';

addMethod(mixed, 'isValidPhoneNumber', isValidPhoneNumber);

function getErrorsFromValidationError(validationError: any) {
    const FIRST_ERROR = 0;
    return validationError.inner.reduce((errors: any, error: any) => {
        return {
            ...errors,
            [error.path]: error.errors[FIRST_ERROR],
        };
    }, {});
}

function handleErrorMeg(msg: any, schema: any) {
    try {
        schema.validateSync(msg, { abortEarly: false });
        return {};
    } catch (error) {
        return getErrorsFromValidationError(error);
    }
}

function isValidPhoneNumber(msg: string) {
    //  const usPhoneRegExp = /^(\([0-9]{3}\) |[0-9]{3})[0-9]{3}[0-9]{4}$/;
    const generalPhoneRegExp = /^[0-9]+$/;

    return mixed().test('isValidPhoneNumber', msg, function(value) {
        if (value) {
            return generalPhoneRegExp.test(value);
        }
        return false;
    });
}

const loginSchema = object().shape({
    email: string().required('email_empty_error'),
    password: string().required('password_empty_error'),
});

const signupSchema = object().shape({
    email: string().required('email_empty_error'),
    password: string().required('password_empty_error'),
});

const fpResetSchema = object().shape({
    newPassword: string().required('password_empty_error'),
    confirmPassword: string()
        .oneOf([Yup.ref('newPassword'), ''], 'password_not_match')
        .required('password_empty_error'),
});

const profileSchema = object().shape({
    name: string().required('Name cannot be blank.'),
});

export function loginValidate(values: LoginInput) {
    return handleErrorMeg(values, loginSchema);
}

export function signupValidate(values: any) {
    return handleErrorMeg(values, signupSchema);
}

export function fpResetValidate(values: any) {
    return handleErrorMeg(values, fpResetSchema);
}

export function profileValidate(values: any) {
    return handleErrorMeg(values, profileSchema);
}
