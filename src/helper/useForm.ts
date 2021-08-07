import { useState, useEffect, useCallback } from 'react';
let thisError: any = {};
interface setSTateType {
    [name: string]: any;
}

const useForm = (initialValues: setSTateType = {}, callback: Function, validate: any) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(thisError);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
        // eslint-disable-next-line
  }, [errors]);

    const handleSubmit = useCallback(() => {
        setErrors(false);
        setIsSubmitting(true);
        if (validate === undefined) {
            setErrors({});
        }
        if (validate === null) {
            setErrors({});
        }
        if (validate !== undefined && validate) {
            setErrors(validate(values));
        }
        // eslint-disable-next-line
  }, [values]);

    const handleCurrentVal = (obj: any) => {
        setValues(obj);
    };

    const resetForm = useCallback(() => {
        setIsSubmitting(false);
        setErrors({});
        setValues(initialValues);
        // eslint-disable-next-line
  }, []);

    const setUpdateValue = useCallback((field, value) => {
        setValues(updateValues => ({
            ...updateValues,
            [field]: value,
        }));
    }, []);

    const handleChange = useCallback(e => {
        setValues(thisValues => ({
            ...thisValues,
            [e.name]: e.value,
        }));
    }, []);

    const handleDateChange = useCallback((date, name = 'date') => {
        date = new Date(date);
        let value = date.getTime();
        setValues(thisValues => ({
            ...thisValues,
            [name]: value,
        }));
        // eslint-disable-next-line
  }, []);

    const handleSelectChange = useCallback((e, name = 'select') => {
        let value = e ? e.value : null;
        setValues(thisValues => ({
            ...thisValues,
            [name]: value,
        }));
        // eslint-disable-next-line
  }, []);

    const handleRadioChange = useCallback(e => {
        let value = e.target.value;
        let name = e.target.name;
        setValues(thisValues => ({
            ...thisValues,
            [name]: value,
        }));
        // eslint-disable-next-line
  }, []);

    const handleCheckboxChange = useCallback((value, name = 'checkbox') => {
        setValues(thisValues => ({
            ...thisValues,
            [name]: value,
        }));
        // eslint-disable-next-line
  }, []);

    return {
        handleChange,
        handleDateChange,
        handleSelectChange,
        handleSubmit,
        values,
        setUpdateValue,
        errors,
        resetForm,
        handleCurrentVal,
        handleCheckboxChange,
        handleRadioChange,
    };
};

export default useForm;
