export default function useFunction() {
    function isEmail(emailVal: string) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(emailVal) == false) {
            return false;
        }

        return true;
    }

    return {
        isEmail,
    };
}
