import { toast } from "react-toastify";

export const wellcomeAlert = (message, theme, time, delay) => {
    toast(message, {
        closeButton: false,
        theme: theme,
        autoClose: time,
        delay: delay,
    });
};

export const successAlert = (message, theme, time, delay) => {
    toast.success(message, {
        theme: theme,
        autoClose: time,
        delay: delay,
    });
};

export const errorAlert = (message, theme, time, delay) => {
    toast.error(message, {
        theme: theme,
        autoClose: time,
        delay: delay,
    });
};

export const warningAlert = (message, theme, time, delay) => {
    toast.warn(message, {
        theme: theme,
        autoClose: time,
        delay: delay,
    });
};

export const infoAlert = (message, theme, time, delay) => {
    toast.info(message, {
        theme: theme,
        autoClose: time,
        delay: delay,
    });
};

export const promiseAlert = () => {
    const functionThatReturnPromise = () =>
        new Promise((resolve, reject) => {
            let randNumber = Math.floor(Math.random() * 10) + 1;
            if (randNumber % 2 === 0) {
                setTimeout(() => resolve(randNumber + " es un número par."), 3000);
            } else {
                setTimeout(() => reject(randNumber + " es un número impar"), 3000);
            }
        });

    toast.promise(functionThatReturnPromise, {
        pending: {
            render() {
                return "Cargando componentes";
            },
        },
        success: {
            render({ data }) {
                return data;
            },
        },
        error: {
            render({ data }) {
                return data;
            },
        },
    });
};
