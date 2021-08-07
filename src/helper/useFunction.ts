export default function useFunction() {
    function isEmail(emailVal: string) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(emailVal) == false) {
            return false;
        }

        return true;
    }

    /**
     * Its use to check only alphabets and space(eg. name)
     */
    function isName(nameVal: string) {
        var reg = /^[a-zA-Z ]*$/;

        if (reg.test(nameVal) == false) {
            return false;
        }

        return true;
    }

    return {
        isEmail,
        isName,
    };
}
