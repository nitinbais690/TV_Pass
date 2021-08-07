export const useEntitlements = () => {
    const initialState = {
        loading: true,
        xAuthToken:
            'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiSldUIn0..hMU1CNOMtmWelJKH.oADB6IlLACpl_rqNCzrv9hcWpFyTGS5GMHytaYhFOx-RqIyJos2oZeiwxr0Gqy3Zr0-BfDzfbpDXzLwP4VBjxjP9VYO7_aY-tlUEFyxNFTezPywfXdSqhxUMik5FNw4FHPlSGW1XAUkF-Z4FL3FllWfXejo-FO-hygqvPb8eDJuutUaMXNl8AU7fI3C-yf-4TLyPANSq8bkHkl-ujHjYFh-EwNa6TX1IC97dSBQzzwzegXkBYdkCO_98eNWkyHIQ9l1idcofx7kVukBc9iM4TVE5861YEikZ_Xftzwd1nf-1vXixNnVbJkm0LUxm9dmt7yyL8Z5wij7EAZZiuBDXEvWpfZdG48jd5avA2ZTusJO1vBov4mQQfFq_cZ8-E54qRlysw6IMDWwz1QG7c8ia_pYSYSKziJn8vNjLFDNkMKClzgw6S_Bqt1Mi7LgBo3zoMns3bEyi2tmJlrBg5W5QHvdrYe4DbK-byAegbqEqf894GsrXk0Jtz9BsVt-PN6oXCznQKLkwY4vNDzlKg3qJsEsig8DfjkvMKjWiZ0VED9mikD25nu-cDmqRZEYYUKFp_YD-4ucg1MC7E-dtEceRjWO-QwzIfQm3tSTZ4yW63mC12FKGpfSKS4sNZ6bXgYlSCGqUrUQjXAaYCj-UuGQ2paff-Kar7UEVg-JOmxpnM2TDZvUze8SpVSGd1lqh0ReWxcydZGfMA67-XsEKSJLSK0agGcrH2bF5TtO48URKZsO4GFZ2vkGiPHJ0QiCnhbDJoul5GZKy8zVJWIf1wvpHLisBwrx_j0VHBzTheuaW7j6AdNoYt21mRXHAT0WzBCcVfMx-lN3_ijaoVZ1m__ABgpWPLI15a7L2buXrs6gPyypzTWIAcr9oAI7lBtqngZzcG-jfWna8lwYnbT2r8D7WKAAd5NBErb1sGDOZ2Yx0xMm1xoTKNGD1SapxOHGyZiGBpouDtm0H0ItkkgPYU1gMttiiRb7v4itR8pNdKj-URB2g7fIp930_L6nyU4PaVzydCLWFDZtRCCrmub2_YkwTY4cJSPPotSOSi3RwyEKuci52k0MAaDcNsw0J1GrKyRdPq3apeZLn5guFbZTsi8A5cmvBrGHDWwkYGA400bJfgEudWa6ecssOpnvlxioTXDoTe70XH2GHI9MB4pNr5tDS9HdzNEl1.8Xx9IAjyZyMsPBjgKkl8UQ',
        error: false,
        errorObject: undefined,
        userAuthDelegate: {
            async fetchUserAuthorizationToken(): Promise<string> {
                return '';
            },
        },
    };

    return initialState;
};
